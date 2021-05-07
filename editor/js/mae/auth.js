// auth demo

function checkAuth( ) {

	var authCookie = document.cookie;

	if ( ! authCookie ) {

		console.log( authCookie );

	} else {

		window.location.href = 'https://mywebar.com/';

	}

}

function getAuthentication() {

	var authCookie = document.cookie;
	return authCookie;

}

export { checkAuth, getAuthentication };
