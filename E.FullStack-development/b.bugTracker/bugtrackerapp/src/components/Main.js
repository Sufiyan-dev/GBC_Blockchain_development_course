import React, { useEffect, useState } from 'react'
import "./Main.css"
import Modal from './Modal';
import config from '../config.json'
import { ethers } from 'ethers';

const bugObjSample = [
    {
        id: 1,
        description: "hello",
        status: 0
    },
    {
        id: 2,
        description: "hello this is an long deswcription",
        status: 1
    },
    {
        id: 3,
        description: "hell this is an medium ",
        status: 1
    },
    {
        id: 6,
        description: "hello",
        status: 2
    }
]

const Main = ({ Address }) => {
    const [bugObj, setBugObj] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [contract, setContract] = useState(null);
    const [loading, setLoading] = useState(false);
    const [StatusLoading, setStatusLoading] = useState(false);

    useEffect(() => {
        // contract helpers
        const initContract = async () => {
            try {
                if (Address) {
                    const provider = new ethers.BrowserProvider(window.ethereum);
                    // Instantiate contract using its ABI and address
                    const contractABI = config.contractAbi;
                    const yourContract = new ethers.Contract(config.contractAddress, contractABI, (await provider.getSigner()));
                    setContract(yourContract);
                }
            } catch (err) {
                console.error('Error initializing contract:', err);
            }
        }
        initContract()
    }, [Address])

    useEffect(() => {
        const bugFetch = async () => {
            try {
                setLoading(true);
                if (contract) {
                    // get bug count
                    const bugCount = await getBugCount();
                    console.log("bug count of user ", bugCount)
                    if (bugCount > 0) {
                        let bugObjArr = [];
                        for (let i = 0; i < bugCount; i++) {
                            const bugInfo = await getBug(i);
                            bugObjArr.push(bugInfo);
                        }
                        setBugObj(bugObjArr);
                    } else {
                        setBugObj([]);
                    }
                }
            } catch (error) {
                console.log("error getting the bug count", error)
            } finally {
                setLoading(false)
            }
        }
        bugFetch();
    }, [contract])

    const createBug = async (bugId, bugDescription) => {
        try {
            if (contract) {
                // Call a write function on your contract
                const tx = await contract.addBug(bugId, bugDescription);
                await tx.wait();
                console.log('new bug txn hash :', tx.hash);
                return tx.hash;
            }
        } catch (error) {
            console.error('Error creating new bug:', error);
            return false;
        }
    }

    const updateBugStatus = async (bugIndex, bugNewStatus) => {
        try {
            if (contract) {
                // Call a write function on your contract
                const tx = await contract.updateBugStatus(bugIndex, bugNewStatus);
                await tx.wait();
                console.log('update bug status txn hash :', tx.hash);
                return tx.hash;
            }
        } catch (error) {
            console.error('Error updating bug:', error);
            return false;
        }
    }

    const getBugCount = async () => {
        try {
            if (contract) {
                // Call a read-only function on contract
                const result = Number(await contract.getBugCount());
                return result;
            }
        } catch (error) {
            console.error('Error getting bug count :', error);
            return false;
        }
    }

    const getBug = async (bugIndex) => {
        try {
            if (contract) {
                // Call a read-only function on contract
                const result = await contract.getBug(bugIndex);
                return { id: Number(result.id), description: result.description, status: Number(result.status) }
            }
        } catch (error) {
            console.error('Error getting bug :', error);
            return false;
        }
    }


    // Model helpers 
    const handleStatusChange = (bugId, newStatus) => {
        setStatusLoading(true);
        // bug index
        const indexOfBug = bugObj.findIndex((bug) =>  bug.id === bugId )
        // console.log(indexOfBug)

        // contract call to update status
        updateBugStatus(indexOfBug, newStatus).then((res) => {
            if(res){
                // Assuming bugObj is a state variable
                setBugObj(() =>
                    bugObj.map((bug) =>
                        bug.id === bugId ? { ...bug, status: newStatus } : bug
                    )
                );
            } else {
                alert("error from metamask")
            }
        }).finally(() => {
            setStatusLoading(false);
        })
    };

    const handleAddBugClick = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const isIdExist = (newId) => {
        // check that id exist or not
        const result = bugObj.some((bug) => bug.id === Number(newId));
        // console.log("exist ", result)
        return result
    }

    const handleModalSubmit = (newId, newDescription) => {
        setStatusLoading(true);
        // contract call 
        createBug(newId, newDescription).then((res) => {
            if(res){

                // Add the new bug to bugObj
                setBugObj((prevBugObj) => [
                    ...prevBugObj,
                    { id: newId, description: newDescription, status: 0 },
                ]);

            } else {
                alert("Error from metamask!!");
            }
        }).finally(() => {
            setStatusLoading(false);
        })
    };

    return (
        <div className='main-wrapper'>
            <div className='main-center'>
                <div className='bug-info-title-wrapper'><div>Id</div><div>Description</div><div>Status</div></div>
                <div className='bug-info-wrapper'>
                    {loading ? <div className='no-bug'>Loading...</div> : bugObj.length === 0 ? <div className='no-bug'>No bugs</div> : bugObj.map((bug,i) => (
                        <div key={i} className='bug-info'>
                            <div className='bug-id'>{bug.id}</div>
                            <div className='bug-description'>{bug.description}</div>
                            <div className='bug-status'>
                                <select value={bug.status} onChange={(e) => handleStatusChange(bug.id, parseInt(e.target.value, 10))}>
                                    <option value={0}>Reported</option>
                                    <option value={1}>In Progress</option>
                                    <option value={2}>Done</option>
                                </select>
                            </div>
                        </div>
                    ))}
                </div>
                <div className={StatusLoading ? 'status-loading' : 'status-none'}><div className='waiting-text'>Wait for txn...</div></div>
            </div>
            <div className='addbug-wrapper'>
                <span></span><button onClick={handleAddBugClick}>Add bug</button>
                <Modal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSubmit={handleModalSubmit}
                    checkExist={isIdExist}
                />
            </div>
        </div>
    )
}

export default Main