function(instance, properties, context) {
	instance.data.walletConnection.signOut()		// Sign out call
    instance.data.checkSignedIn()					// Check for signed in to refresh state
    instance.triggerEvent('disconnected')
}