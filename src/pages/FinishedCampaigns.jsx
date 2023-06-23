import React from 'react'

const FinishedCampaigns = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [campaigns, setCampaigns] = useState([])

    const { address, contract, getCampaigns } = useStateContext()

    const fetchCampaigns = async () => {
        const finishedData = []
        setIsLoading(true)
        const data = await getCampaigns()
        data.forEach((e) => {
            return e.state == 'finished';
        })

        setCampaigns(finishedData)
        setIsLoading(false)
    }

    useEffect(() => {
        if (contract) fetchCampaigns()
    }, [address, contract])


    return (
        <DisplayCampaigns
            title='Finished Campaigns'
            isLoading={isLoading}
            campaigns={campaigns}
        />
    )
}

export default FinishedCampaigns