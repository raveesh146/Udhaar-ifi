"use client";
import React, { useMemo, useState, useEffect } from "react";
import { useApp } from "@/context/AppProvider";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Token } from "@/types/Token";
import { toast } from "sonner";
import { useFormik } from "formik";
import Image from 'next/image'
import { IoIosArrowDown } from 'react-icons/io'
import { IoClose } from 'react-icons/io5'
import { MdCollections } from "react-icons/md";
import { MdOutlineToken } from "react-icons/md";

import { MAX_LOCK_DURATION } from "@/utils/aptos";
import * as Yup from "yup";
import { ButtonLoading } from "@/components/ButtonLoading";
import { LISTING_CHANNEL_ID } from "@/utils/env";
import { useKeylessAccounts } from "@/core/useKeylessAccounts";

export const assetListingModalId = "assetListingModal";
interface ListingModalProps {
    token: Token | null;
    getUserListings: () => Promise<void>
}
export function ListingModal({ token, getUserListings }: ListingModalProps) {
    const { assets, getAssetByType } = useApp();
    const { account } = useWallet();
    const { activeAccount } = useKeylessAccounts()
    const [dropdownToken, setDropdownToken] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);
    const { values, handleSubmit, handleChange, setFieldValue, errors, touched } = useFormik({
        initialValues: {
            coin: "",
            amount: "",
            duration: "",
            apr: ""
        },
        validationSchema: Yup.object({
            amount: Yup.number().typeError("Amount must be a number").positive("Amount must be +ve"),
            duration: Yup.number().min(1, "Minimum 1 day required").max(MAX_LOCK_DURATION, `Max ${MAX_LOCK_DURATION} day allowed`),
            apr: Yup.number().positive("Apr must be +ve"),
        }),
        onSubmit: async (data) => {
            if ((!account?.address && !activeAccount?.accountAddress) || !token) return;

            setSubmitLoading(true)
            try {
                const account_address = activeAccount ? activeAccount.accountAddress?.toString() : account?.address
                const formData = {
                    ...data,
                    address: account_address,
                    collection_id: token.collection_id,
                    collection_name: token.collection_name,
                    token_data_id: token.token_data_id,
                    token_icon: token.token_icon_uri,
                    token_name: token.token_name,
                    token_standard: token.token_standard,
                    coin: data.coin !== "" ? data.coin : null,
                }
                const res = await fetch("/api/listing", {
                    method: "POST",
                    headers: {
                        contentType: "application/json"
                    },
                    body: JSON.stringify(formData)
                });
                const response = await res.json();
                if (!res.ok) {
                    throw new Error(response.message)
                }
                document.getElementById("closeAssetListingModal")?.click();
                toast.success("Item listed successfully")
                await getUserListings()
                /// 
                // Discord embed to discord server 
                ///
                await fetch(`/api/discord-bot/send-listing-embed`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        recepient_id: LISTING_CHANNEL_ID,
                        title: `${token.token_name}`,
                        image: token.token_icon_uri,
                        url: `${window.location.origin}/lend/assets`,
                        amount: data.amount != "" ? data.amount : null,
                        coin: data.coin ? getAssetByType(data.coin)?.symbol : null,
                        apr: data.apr !== "" ? data.apr : null,
                        duration: data.duration !== "" ? data.duration : null
                    })
                });
                await fetch("/api/telegram/send-photo", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        title: `${token.token_name}`,
                        image: token.token_icon_uri,
                        url: `${window.location.origin}/lend/assets`,
                        amount: data.amount != "" ? data.amount : null,
                        coin: data.coin ? getAssetByType(data.coin)?.symbol : null,
                        apr: data.apr !== "" ? data.apr : null,
                        duration: data.duration !== "" ? data.duration : null
                    })
                })
            } catch (error: unknown) {
                let errorMessage = 'An unexpected error occurred';
                if (error instanceof Error) {
                    errorMessage = error.message;
                }
                toast.error(errorMessage);
            } finally {
                setSubmitLoading(false)
            }
        }
    })
    const chosenCoin = useMemo(() => {
        if (values.coin && values.coin !== "") {
            return assets.find((asset) => asset.asset_type === values.coin);
        }
    }, [assets, values.coin])

    // Add this useEffect to handle modal cleanup
    useEffect(() => {
        const modal = document.getElementById(assetListingModalId);
        if (modal) {
            const handleModalHidden = () => {
                setDropdownToken(true);
                setFieldValue("coin", "");
                setFieldValue("amount", "");
                setFieldValue("duration", "");
                setFieldValue("apr", "");
            };
            
            modal.addEventListener('hidden.bs.modal', handleModalHidden);
            return () => {
                modal.removeEventListener('hidden.bs.modal', handleModalHidden);
            };
        }
    }, [setFieldValue]);

    // Add click outside handler for dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const dropdown = document.querySelector('.coll-dropdown');
            if (dropdown && !dropdown.contains(event.target as Node)) {
                setDropdownToken(true);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Modify dropdown click handler
    const handleDropdownClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDropdownToken(!dropdownToken);
    };

    // Modify coin selection handler
    const handleCoinSelect = (coin: string | null) => {
        setFieldValue("coin", coin || "");
        setDropdownToken(true);
    };

    return (
        <div 
            className="modal fade" 
            id={assetListingModalId} 
            tabIndex={-1} 
            aria-labelledby={`${assetListingModalId}Label`}
            data-bs-backdrop="static" // Prevent closing when clicking outside
        >
            <div className="modal-dialog modal-dialog-centered modal-xl">
                <div className="modal-content bg-gray-800">
                    <button 
                        type="button" 
                        className="absolute top-2 right-2 text-gray-400 hover:text-white"
                        data-bs-dismiss="modal"
                    >
                        <IoClose size={24} />
                    </button>
                    
                    {
                        token &&
                        <div className="row">
                            <div className="col-lg-3 p-0">
                                <div className="nft">
                                    <Image src={token.token_icon_uri ?? ""} className="asset-img" alt={token.token_name} width={150} height={200} />
                                </div>
                                <div className="nft-details">
                                    <h4 className="text-center">{token.token_name}</h4>
                                    <p><MdCollections className="text-light" /> {token.collection_name}</p>
                                    <p><MdOutlineToken className="text-light" />{token.token_standard}</p>
                                    <p className="desc">{token.token_description}</p>
                                </div>

                            </div>
                            <div className="col-lg-9 p-0 ps-5">
                                <h3>Asset Listing</h3>
                                <form className="asset-form pt-4" onSubmit={handleSubmit} autoComplete="off">
                                    <div className="mb-3">
                                        <div className="form-group">
                                            <div className="dropdown-btn select-field">
                                                <button type="button" className="rounded text-start w-100" onClick={handleDropdownClick}>
                                                    {
                                                        chosenCoin ? chosenCoin.symbol : "Any Coin"
                                                    }
                                                    <IoIosArrowDown className="dd-icon" /></button>
                                            </div>
                                        </div>
                                        <div className="coll-dropdown rounded select-dropdown" hidden={dropdownToken}>
                                            <div className="coll-item" onClick={() => handleCoinSelect("")}>
                                                <p>Any Coin</p>
                                            </div>
                                            {
                                                assets.map(fa => (
                                                    <div className="coll-item" onClick={() => handleCoinSelect(fa.asset_type)} key={fa.asset_type}>
                                                        <p>
                                                            {fa.symbol}</p>
                                                    </div>
                                                ))}
                                        </div>
                                        {errors.coin && touched.coin && <span className="text-danger">{errors.coin}</span>}
                                    </div>
                                    <div className="mb-3">
                                        <input type="text" name="amount" value={values.amount} onChange={handleChange} placeholder="Enter Amount" className="form-control" />
                                        {errors.amount && touched.amount && <span className="text-danger">{errors.amount}</span>}
                                    </div>
                                    <div className="mb-3">
                                        <input type="text" name="duration" value={values.duration} onChange={handleChange} placeholder={`Enter Duration (1 day - ${MAX_LOCK_DURATION} days)`} className="form-control" />
                                        {errors.duration && touched.duration && <span className="text-danger">{errors.duration}</span>}
                                    </div>
                                    <div className="mb-3">
                                        <input type="text" name="apr" value={values.apr} onChange={handleChange} className="form-control" placeholder="Enter APR (%)" />
                                        {errors.apr && touched.apr && <span className="text-danger">{errors.apr}</span>}
                                    </div>
                                    {
                                        submitLoading
                                            ?
                                            <ButtonLoading className="submit-btn" />
                                            :
                                            <input type="submit" className="submit-btn rounded" />
                                    }
                                </form>
                                <p className="mt-4 notice"><strong>Notice:</strong>This action is entirely free of transaction gas fees and won&apos;t impact your NFT ownership! Plus, all details above are optional.</p>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}