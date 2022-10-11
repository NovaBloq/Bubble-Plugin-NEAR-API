function(instance, context) {
	const { keyStores, connect, WalletConnection, utils } = nearApi
	const myKeyStore = new keyStores.BrowserLocalStorageKeyStore()
    
    instance.data.round = (value, decimals) => Number(Math.round(value + 'e' + decimals) + 'e-' + decimals)
    
    instance.data.initApi = async (network) => {
        const connectionConfig = {
            networkId: network,										// Network
            keyStore: myKeyStore,									// first create a key store 
            nodeUrl: `https://rpc.${network}.near.org`,				// Node URL
            walletUrl: `https://wallet.${network}.near.org`,		// Wallet URL
            helperUrl: `https://helper.${network}.near.org`,		// Helper URL
            explorerUrl: `https://explorer.${network}.near.org`,	// Explorer URL
        }
        instance.data.nearConnection = await connect(connectionConfig)
        instance.data.walletConnection = new WalletConnection(instance.data.nearConnection)
    }
    
    instance.data.checkSignedIn = () => {
        if (instance.data.walletConnection && instance.data.walletConnection.isSignedIn()) {
            instance.publishState('is_signed_in', true)
            instance.triggerEvent('connected')
        } else {
            instance.publishState('is_signed_in', false)
        }
    }
    instance.data.getAccountId = () => instance.data.walletConnection && instance.publishState('account_id', instance.data.walletConnection.getAccountId())
    
    instance.data.loadAccount = async () => {
        if (instance.data.nearConnection && instance.data.walletConnection) {
            instance.data.account = await instance.data.nearConnection.account(instance.data.walletConnection.getAccountId())
        }
    }
    
    instance.data.getAccountBalance = async () => {
        if (instance.data.account) {
            instance.data.balance = await instance.data.account.getAccountBalance()
            const { available, staked, total, stateStaked } = instance.data.balance
            instance.publishState('available', instance.data.round(utils.format.formatNearAmount(available), 4))
            instance.publishState('staked', instance.data.round(utils.format.formatNearAmount(staked), 4))
            instance.publishState('state_staked', instance.data.round(utils.format.formatNearAmount(stateStaked), 4))
            instance.publishState('total', instance.data.round(utils.format.formatNearAmount(total), 4))
        }
    }
    
    instance.data.isJSON = (s) => {
        try {
            JSON.parse(s)
        } catch (e) {
            return false
        }
        return isNaN(s)
    }
}