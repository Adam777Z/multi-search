document.addEventListener('DOMContentLoaded', () => {
	const params = new URLSearchParams( window.location.search );
	const q = params.get( 'q' ) || '';

	if ( ! q ) {
		// window.location.href = 'https://www.google.com/';
		// window.location.href = 'https://www.bing.com/';
		// window.location.href = 'https://duckduckgo.com/';
		// window.location.href = 'https://www.ecosia.org/';
		// window.location.href = 'https://www.startpage.com/';
		// window.location.href = 'https://search.brave.com/';

		// window.open( 'https://www.google.com/', '_self' );
		// window.open( 'https://www.bing.com/', '_self' );
		// window.open( 'https://duckduckgo.com/', '_self' );
		// window.open( 'https://www.ecosia.org/', '_self' );
		// window.open( 'https://www.startpage.com/', '_self' );
		// window.open( 'https://search.brave.com/', '_self' );
	} else {
		const query = new URLSearchParams( { q } ).toString();

		// Redirect current page (close does not work)

		// window.location.href = 'https://www.bing.com/';
		// window.location.href = 'about:blank';

		window.open( 'https://www.google.com/search?' + query, '_self' );

		// Opened in reverse order
		// Activated when opened

		window.open( 'https://search.brave.com/search?' + query, '_blank' );
		window.open( 'https://duckduckgo.com/?' + query + '&ia=web', '_blank' );
		window.open( 'https://www.bing.com/search?' + query + '&form=QBLH', '_blank' );
		// window.open( 'https://www.google.com/search?' + query, '_blank' );
		window.open( 'https://www.startpage.com/sp/search?query=' + query, '_blank' );
		window.open( 'https://www.ecosia.org/search?' + query, '_blank' );

		// window.close(); // Does not work
	}
});