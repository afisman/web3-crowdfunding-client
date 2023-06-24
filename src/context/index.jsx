import React, { useContext, createContext } from 'react';

import { useAddress, useContract, useMetamask, useContractWrite } from '@thirdweb-dev/react';
import { ethers } from 'ethers';

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {

    // const { contract } = useContract('0xA8a7121b0c9D3860c56699e4423eAE1F83DFD706'); //Old contract
    const { contract } = useContract('0x9BE7Bcc55BBDf668AA9618Bc75Ee619d16d7eb63');
    const { mutateAsync: createCampaign } = useContractWrite(contract, 'createCampaign');

    const address = useAddress();
    const connect = useMetamask();

    const publishCampaign = async (form) => {

        try {
            const data = await createCampaign({
                args: [
                    address,
                    form.title,
                    form.description,
                    form.target,
                    new Date(form.deadline).getTime(),
                    form.image
                ]
            })
            console.log('contract call success', data)
        } catch (error) {
            console.log('contract call failure', error)
        }

    }

    const getCampaigns = async () => {
        const campaigns = await contract.call('getCampaigns')

        const filteredCampaigns = campaigns.filter((campaign) =>
            campaign.state == 0
        )
        const parsedCampaigns = filteredCampaigns.map((campaign, i) => ({
            owner: campaign.owner,
            title: campaign.title,
            description: campaign.description,
            target: ethers.utils.formatEther(campaign.target.toString()),
            deadline: campaign.deadline.toNumber(),
            amountCollected: ethers.utils.formatEther(campaign.amountCollected.toString()),
            image: campaign.image,
            state: campaign.state,
            pId: i
        }));

        return parsedCampaigns;
    }

    const getUserCampaigns = async () => {

        const allCampaigns = await getCampaigns();

        const filteredCampaigns = allCampaigns.filter((campaign) => campaign.owner === address);

        return filteredCampaigns;
    }

    const donate = async (pId, amount) => {
        console.log(ethers.utils.parseEther(amount))
        const data = await contract.call('donateToCampaign', [pId], { value: ethers.utils.parseEther(amount) });
        // const data = await contract.call('donateToCampaign', pId, {
        //     value: ethers.utils.parseEther(amount)
        // });

        return data
    }

    const getDonations = async (pId) => {
        const donations = await contract.call('getDonators', [pId]);
        const numberOfDonations = donations[0].length;

        const parsedDonations = [];

        for (let i = 0; i < numberOfDonations; i++) {
            parsedDonations.push({
                donator: donations[0][i],
                donation: ethers.utils.formatEther(donations[1][i].toString())
            })
        }

        return parsedDonations
    }

    return <StateContext.Provider
        value={{
            address,
            contract,
            connect,
            createCampaign: publishCampaign,
            getCampaigns,
            getUserCampaigns,
            donate,
            getDonations
        }}
    >
        {children}
    </StateContext.Provider>
}

export const useStateContext = () => useContext(StateContext)