// src/components/SellerDashboard/SellerInfo/AddressSearchModal.tsx

import React, { useState, useRef, useEffect } from "react";
import {
    Box,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    CircularProgress,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { BRAND_COLORS, SecondaryButton } from "./constants";

// ==================== 카카오 주소 검색 API 타입 선언 ====================
declare global {
    interface Window {
        daum?: {
            Postcode: new (options: {
                oncomplete: (data: any) => void;
                onclose?: () => void;
                width?: string;
                height?: string;
            }) => {
                embed: (element: HTMLElement) => void;
            };
        };
    }
}

// ==================== 인터페이스 ====================
interface AddressData {
    postalCode: string;
    roadAddress: string;
    city: string;           // 시/도
    district: string;       // 시군구
    neighborhood: string;   // 동/읍/면
    streetAddress: string;  // 도로명 + 번지
}

interface AddressSearchModalProps {
    open: boolean;
    onClose: () => void;
    onSelect: (address: AddressData) => void;
}

// ==================== 카카오 주소 검색 모달 ====================
const AddressSearchModal: React.FC<AddressSearchModalProps> = ({
                                                                   open,
                                                                   onClose,
                                                                   onSelect,
                                                               }) => {
    const postcodeRef = useRef<HTMLDivElement>(null);
    const [scriptLoaded, setScriptLoaded] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 스크립트 로드 함수
    const loadScript = () => {
        return new Promise<void>((resolve, reject) => {
            if (window.daum) {
                resolve();
                return;
            }

            const script = document.createElement("script");
            script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
            script.async = true;
            script.onload = () => {
                console.log("Daum Postcode script loaded successfully");
                resolve();
            };
            script.onerror = () => {
                console.error("Failed to load Daum Postcode script");
                reject(new Error("스크립트 로드에 실패했습니다."));
            };
            document.head.appendChild(script);
        });
    };

    // 시/도명 정규화 함수
    const normalizeCityName = (sido: string): string => {
        const cityMappings: Record<string, string> = {
            '서울': '서울특별시',
            '부산': '부산광역시',
            '대구': '대구광역시',
            '인천': '인천광역시',
            '광주': '광주광역시',
            '대전': '대전광역시',
            '울산': '울산광역시',
            '세종': '세종특별자치시',
            '경기': '경기도',
            '강원': '강원특별자치도',
            '충북': '충청북도',
            '충남': '충청남도',
            '전북': '전북특별자치도',
            '전남': '전라남도',
            '경북': '경상북도',
            '경남': '경상남도',
            '제주': '제주특별자치도'
        };

        return cityMappings[sido] || sido;
    };

    // 도로명과 번지수 분리 함수
    const extractStreetAndNumber = (roadAddress: string, sido: string, sigungu: string): string => {
        // 전체 주소에서 시/도, 시군구를 제거하여 도로명+번지만 추출
        const prefix = `${sido} ${sigungu} `;
        if (roadAddress.startsWith(prefix)) {
            const remaining = roadAddress.substring(prefix.length);
            // 동명이 포함된 경우 제거 (예: "역삼동 테헤란로 123" → "테헤란로 123")
            const parts = remaining.split(' ');
            if (parts.length > 1 && parts[0].endsWith('동')) {
                return parts.slice(1).join(' ');
            }
            return remaining;
        }
        return roadAddress;
    };

    // 스크립트 로드
    useEffect(() => {
        const initScript = async () => {
            try {
                setLoading(true);
                setError(null);
                await loadScript();
                setScriptLoaded(true);
            } catch (err) {
                setError(err instanceof Error ? err.message : "스크립트 로드 오류");
                console.error("Script loading error:", err);
            } finally {
                setLoading(false);
            }
        };

        initScript();
    }, []);

    // 주소 검색 초기화 함수
    const initializePostcode = () => {
        if (!postcodeRef.current || !window.daum) {
            console.error("Postcode ref or daum object not available");
            return;
        }

        try {
            // 기존 내용 제거
            postcodeRef.current.innerHTML = "";

            console.log("Initializing Daum Postcode...");

            const postcode = new window.daum.Postcode({
                oncomplete: (data: any) => {
                    console.log("카카오 주소 API 응답:", data);

                    // 도로명 주소 우선, 없으면 지번 주소 사용
                    const fullAddress = data.roadAddress || data.jibunAddress;

                    // 카카오 API에서 제공하는 개별 필드들을 활용하여 주소 분리
                    const addressData: AddressData = {
                        postalCode: data.zonecode,
                        roadAddress: fullAddress,
                        city: normalizeCityName(data.sido),           // 시/도 정규화
                        district: data.sigungu,                      // 시군구
                        neighborhood: data.bname2 || data.bname || '', // 동명 (bname2 우선, 없으면 bname)
                        streetAddress: extractStreetAndNumber(fullAddress, data.sido, data.sigungu) // 도로명+번지만 추출
                    };

                    console.log("파싱된 주소 정보:", addressData);

                    // 부모 컴포넌트에 상세한 주소 정보 전달
                    onSelect(addressData);
                    onClose();
                },
                onclose: () => {
                    console.log("Daum Postcode closed");
                },
                width: "100%",
                height: "400px",
            });

            postcode.embed(postcodeRef.current);
            console.log("Daum Postcode embedded successfully");
        } catch (error) {
            console.error("Error initializing postcode:", error);
            setError("주소 검색 초기화에 실패했습니다.");
        }
    };

    // 모달이 열릴 때 주소 검색 초기화
    useEffect(() => {
        if (open && scriptLoaded && !loading && !error) {
            // 약간의 지연을 주어 DOM이 완전히 렌더링되도록 함
            const timer = setTimeout(() => {
                initializePostcode();
            }, 100);

            return () => clearTimeout(timer);
        }
    }, [open, scriptLoaded, loading, error]);

    const handleRetry = () => {
        setError(null);
        setScriptLoaded(false);
        setLoading(true);

        // 기존 스크립트 제거
        const existingScript = document.querySelector('script[src*="postcode.v2.js"]');
        if (existingScript) {
            existingScript.remove();
        }

        // 다시 로드
        loadScript()
            .then(() => setScriptLoaded(true))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    minHeight: "500px",
                    borderRadius: 3
                }
            }}
        >
            <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" fontWeight="600">
                        주소 검색
                    </Typography>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>
            <DialogContent>
                <Box
                    sx={{
                        width: "100%",
                        minHeight: "400px",
                        border: `1px solid ${BRAND_COLORS.BORDER}`,
                        borderRadius: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column"
                    }}
                >
                    {loading && (
                        <>
                            <CircularProgress sx={{ color: BRAND_COLORS.PRIMARY }} />
                            <Typography variant="body2" sx={{ mt: 2, color: BRAND_COLORS.TEXT_SECONDARY }}>
                                주소 검색 서비스를 불러오는 중...
                            </Typography>
                        </>
                    )}

                    {error && (
                        <>
                            <Typography variant="body2" color="error" sx={{ mb: 2 }}>
                                {error}
                            </Typography>
                            <SecondaryButton onClick={handleRetry}>
                                다시 시도
                            </SecondaryButton>
                        </>
                    )}

                    {!loading && !error && (
                        <div ref={postcodeRef} style={{ width: "100%", height: "400px" }} />
                    )}
                </Box>
            </DialogContent>
            <DialogActions>
                <SecondaryButton onClick={onClose}>
                    취소
                </SecondaryButton>
            </DialogActions>
        </Dialog>
    );
};

export default AddressSearchModal;