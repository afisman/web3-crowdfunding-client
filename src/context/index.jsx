import React, { useContext, createContext } from 'react';

import { useAddress, useContract, useMetamask, useContractWrite } from '@thirdweb-dev/react';
import { ethers } from 'ethers';

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
    const { contract } = useContract('0xA8a7121b0c9D3860c56699e4423eAE1F83DFD706');

    const { mutateAsync: createCampaign } = useContractWrite(contract, 'createCampaign');

    const address = useAddress();
    const connect = useMetamask();

    const publishCampaign = async (form) => {

        try {
            const data = await createCampaign([
                address,
                form.title,
                form.description,
                form.target,
                new Date(form.deadline).getTime(),
                form.image
            ])
            console.log('contract call success', data)
        } catch (error) {
            console.log('contract call failure', error)
        }

    }

    return <StateContext.Provider
        value={{
            address,
            contract,
            connect,
            createCampaign: publishCampaign
        }}
    >
        {children}
    </StateContext.Provider>
}

export const useStateContext = () => useContext(StateContext)