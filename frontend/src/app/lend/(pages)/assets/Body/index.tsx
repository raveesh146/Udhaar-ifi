"use client"
import { IListingSchema } from "@/models/listing"
import Image from "next/image"
import React, { useEffect, useMemo, useState } from "react"
import { BsFillGridFill, BsList } from "react-icons/bs"
import { LendModal, lendModalId } from "../LendModal"
import { useApp } from "@/context/AppProvider"
import { Listing } from "@/types/ApiInterface"
import { useWallet } from "@aptos-labs/wallet-adapter-react"
import { IoNewspaperOutline } from "react-icons/io5";
import { useKeylessAccounts } from "@/core/useKeylessAccounts"
import { IoIosArrowDown } from "react-icons/io"
import { MdFilter } from "react-icons/md"
type Collection = {
    name: string;
    id: string;
}
export function Body() {
    const { activeAccount } = useKeylessAccounts()
    const { account } = useWallet();
    const [view, setView] = useState("grid");
    const [tokensListing, setTokensListing] = useState<Listing[]>([])
    const [loading, setLoading] = useState(true);
    const [dropdown, setDropdown] = useState(true);
    const [chosenCollection, setChosenCollection] = useState<Collection | null>(null)
    useEffect(() => {
        async function getTokensListing() {
            try {
                const res = await fetch(`/api/listing?status=open`);
                if (res.ok) {
                    const response = await res.json();
                    setTokensListing(response.data)
                }
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }
        getTokensListing()
    }, [setTokensListing]);
    const notMyListings = useMemo(() => {
        const address = activeAccount ? activeAccount?.accountAddress?.toString() : account?.address
        if (!address) return tokensListing;
        return tokensListing.filter((token) => token.address !== address)
    }, [tokensListing, account?.address, activeAccount])
    const collections = useMemo(()=>{
        const newArr: Collection[] = [];
        notMyListings.forEach((item)=>{
            if(!newArr.some(v => v.id === item.collection_id)){
                newArr.push({
                    name: item.collection_name,
                    id: item.collection_id
                })
            }
        })
        return newArr;
    },[notMyListings])
    const handleCollectionSelect = (collection: Collection|null) => {
        setChosenCollection(collection)
        setDropdown(!dropdown); // Close the dropdown after selection
    };
    const tokens = useMemo(()=>{
        if(!chosenCollection){
            return notMyListings;
        }
        return notMyListings.filter((token)=> token.collection_id === chosenCollection.id)
    },[chosenCollection, notMyListings])
    return (
        <React.Fragment>
            <div className="content-header d-flex mb-4">
            <div className="collection">
                    <div className="dropdown-btn sl-coll">
                        <span className="me-2 fs-6">Select Collection:</span>
                        {
                            !loading && collections.length > 0
                            &&
                            <button className="rounded text-start coll-btn" onClick={() => setDropdown(!dropdown)}>
                                {
                                  chosenCollection ? chosenCollection.name : "Any"
                                }
                                <IoIosArrowDown className="dd-icon" /></button>
                        }

                    </div>
                    <MdFilter className="mb-coll-filter d-none rounded" onClick={() => setDropdown(!dropdown)} />

                    <div className="coll-dropdown cl-1 rounded" hidden={dropdown}>
                        <div className="coll-item" onClick={() => handleCollectionSelect(null)}>
                            <p>Any</p>
                        </div>
                        {collections.map((collection, index) => (
                            <div className="coll-item" key={index} onClick={() => handleCollectionSelect(collection)}>
                                <p>{collection.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="view-type d-flex align-items-center">
                    <span className="me-2">View:</span>
                    <div className="dsp-layout">
                        <BsFillGridFill className={`layout-icon me-1 ${view == 'grid' ? 'active' : ''}`} onClick={() => setView('grid')} />
                        <BsList className={`layout-icon me-1 ${view == 'list' ? 'active' : ''}`} onClick={() => setView('list')} />
                    </div>
                </div>
            </div>
            <div className="content-body">
                <TokenListings viewtype={view} tokens={tokens} loading={loading} />
            </div>
        </React.Fragment>
    )
}
interface TokenListingsProps {
    viewtype: string;
    tokens: IListingSchema[];
    loading: boolean;
}
export function TokenListings({ viewtype, tokens, loading }: TokenListingsProps) {
    const { getAssetByType } = useApp();
    const [chosenToken, setChosenToken] = useState<IListingSchema | null>(null);

    return (
        <React.Fragment>
            {tokens.length === 0 && !loading && (
                <>
                    <div className="empty-box text-center py-5 px-3 rounded">
                        <IoNewspaperOutline className="fs-1" />
                        <p className="mt-2 w-100 text-center">No Borrowers available</p>
                    </div>
                </>
            )}

            <div className="all-cards grid-view" hidden={viewtype == 'grid' ? false : true}>
                {
                    loading ?
                        Array.from({ length: 6 }).map((_, index) => (
                            <div className="card border-0" key={index}>
                                <span className="line p-5 w-100 mt-0"></span>
                                <div className="card-body pb-4">
                                    <p className="px-3 pt-3"><span className="line"></span></p>
                                    <p className="px-3 pt-3"><span className="line w-100"></span></p>
                                    <p className="px-3 pt-3"><span className="line w-75"></span></p>
                                    <p className="px-3 pt-3"><span className="line w-100"></span></p>
                                </div>
                            </div>
                        ))
                        :
                        tokens.map((token) => (
                            <div className="card border-0" key={token.token_data_id}>
                                <Image src={`${token.token_icon}`} className="card-img-top w-100" alt={token.token_name} width={150} height={230} />
                                <div className="card-body ">
                                    <h4 className="card-title">{token.token_name}</h4>
                                    <p className="card-text p-2">{token.collection_name}</p>
                                    <h6 className="px-2">Borrower&apos;s Ask:</h6>
                                    <p className="p-2">
                                        <span className="txt-primary">{token.amount} {token.coin ? getAssetByType(token.coin)?.symbol: "Any coin"}</span>&nbsp;with
                                        &nbsp;
                                        <span className="txt-primary">{token.apr ?? "any"}</span>&nbsp;APR for
                                        &nbsp;
                                        <span className="txt-primary">{token.duration ?? "any"}</span>&nbsp;days.
                                    </p>
                                    <button onClick={() => setChosenToken(token)} data-bs-toggle="modal" data-bs-target={`#${lendModalId}`} className="btn list-btn w-100 mt-3">Give Loan</button>
                                </div>
                            </div>
                        ))
                }
            </div>

            {/* List View */}
            <div className="list-view lend" hidden={viewtype == 'list' ? false : true}>
                <table className="table">
                    {tokens.length > 0 && (
                        <thead>
                            <tr>
                                <th>Token Name</th>
                                <th>Token Standard</th>
                                <th>Collection</th>
                                <th>Amount</th>
                                <th>Duration in days</th>
                                <th>APR %</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                    )}
                    <tbody>
                        {
                            loading ?
                                Array.from({ length: 5 }).map((_, index) => (
                                    <tr key={index}>
                                        <td className="text-center"><span className="line"></span></td>
                                        <td className="text-center"><span className="line"></span></td>
                                        <td className="text-center"><span className="line"></span></td>
                                        <td className="text-center"><span className="line"></span></td>
                                        <td className="text-end"><span className="line"></span></td>
                                    </tr>
                                ))
                                :
                                tokens.map((token) => (
                                    <tr key={token.token_data_id}>
                                        <td>
                                            <Image src={`${token.token_icon}`} className="rounded me-2" alt="nft" width={32} height={32} />
                                            <span className="fs-5">{token.token_name} </span>
                                            {/* <span className="d-none ts-mobile">({token.token_standard})</span><br />
                                            <p className="d-none ts-mobile pt-2">{token.collection_name}</p><br />
                                            <p className="d-none ts-mobile">{token.apr}%</p> */}
                                        </td>
                                        <td>{token.token_standard}</td>
                                        <td>{token.collection_name}</td>
                                        <td>{token.amount} {token.coin ? getAssetByType(token.coin)?.symbol : ""}</td>
                                        <td>{token.duration}</td>
                                        <td>{token.apr}</td>
                                        <td>
                                            <button onClick={() => setChosenToken(token)} className="action-btn rounded" data-bs-toggle="modal" data-bs-target={`#${lendModalId}`}>Give Loan</button>
                                            {/* <p className="d-none ts-mobile pt-2">{token.amount} {token.coin ? getAssetByType(token.coin)?.symbol : ""}</p><br />
                                            <p className="d-none ts-mobile">{token.duration}D</p> */}
                                        </td>
                                    </tr>
                                ))
                        }
                    </tbody>
                </table>
            </div>
            <LendModal token={chosenToken} />
        </React.Fragment>
    )
}