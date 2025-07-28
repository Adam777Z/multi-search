<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8" />
	<title>Multi Search</title>
	<meta name="description" content="Multi Search enables searches to be performed using multiple search engines at once, resulting in saved time and improved results."">
</head>
<body>
<script>
document.addEventListener( 'DOMContentLoaded', ( event ) => {
	var q = <?php echo json_encode( isset( $_GET['q'] ) ? $_GET['q'] : '' ); ?>;

	if ( !q ) {
		// window.location.href = 'https://www.google.com/';
		window.location.href = 'https://www.bing.com/';
		// window.location.href = 'https://duckduckgo.com/';
		// window.location.href = 'https://search.brave.com/';

		// window.open( 'https://www.google.com/', '_self' );
		// window.open( 'https://www.bing.com/', '_self' );
		// window.open( 'https://duckduckgo.com/', '_self' );
		// window.open( 'https://search.brave.com/', '_self' );

		return;
	}

	// Redirect current page (close does not work)

	// window.location.href = 'https://www.bing.com/';
	// window.location.href = 'about:blank';

	window.open( 'https://www.google.com/search?q=' + encodeURIComponent( q ), '_self' );
	// window.open( 'https://www.bing.com/search?q=' + encodeURIComponent( q ), '_self' );
	// window.open( 'https://duckduckgo.com/?q=' + encodeURIComponent( q ) + '&ia=web', '_self' );
	// window.open( 'https://search.brave.com/search?q=' + encodeURIComponent( q ), '_self' );

	// Opened in reverse order
	// Activated when opened

	// window.open( 'https://www.google.com/search?' + new URLSearchParams({ q }).toString(), '_blank' );
	window.open( 'https://www.bing.com/search?' + new URLSearchParams({ q }).toString(), '_blank' );
	window.open( 'https://duckduckgo.com/?' + new URLSearchParams({ q }).toString() + '&ia=web', '_blank' );
	window.open( 'https://search.brave.com/search?' + new URLSearchParams({ q }).toString(), '_blank' );

	// window.close(); // Does not work
});
</script>
</body>
</html>