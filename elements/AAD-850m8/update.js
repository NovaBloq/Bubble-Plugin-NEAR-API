function(instance, properties, context) {
    const { networkId } = properties
    
    // Initiate api
    instance.data.initApi(networkId).then(() => {
        instance.data.checkSignedIn()							// Check if signed in to refresh state
        instance.data.getAccountId()							// Check account id to refresh state
        instance.data.loadAccount()								// Save account reference
        instance.data.getAccountBalance()						// Read account balance
    })
}