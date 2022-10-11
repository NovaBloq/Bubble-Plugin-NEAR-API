function(instance, properties, context) {
	const { contract_address, app_tite, redirect_url_on_success, redirect_url_on_failure } = properties
    
    instance.data.walletConnection.requestSignIn(
        contract_address, 			// contract requesting access
        app_tite, 					// optional title
        redirect_url_on_success, 	// optional redirect URL on success
        redirect_url_on_failure 	// optional redirect URL on failure
    )
}