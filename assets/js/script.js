const DEFAULT_SEARCH_ENGINES = [
	{ name: 'Google', url: 'https://www.google.com/search?q=%s' },
	{ name: 'Brave', url: 'https://search.brave.com/search?q=%s' },
	{ name: 'DuckDuckGo', url: 'https://duckduckgo.com/?q=%s&ia=web' },
	{ name: 'Bing', url: 'https://www.bing.com/search?q=%s&form=QBLH' },
	{ name: 'Startpage', url: 'https://www.startpage.com/sp/search?query=%s' },
	{ name: 'Ecosia', url: 'https://www.ecosia.org/search?q=%s' },
];
const STORAGE_KEY = 'multi-search-engines';

function cloneSearchEngines( searchEngines ) {
	return searchEngines.map( ( searchEngine ) => ( { ...searchEngine } ) );
}

function loadSearchEngines() {
	try {
		const stored = JSON.parse( localStorage.getItem( STORAGE_KEY ) );
		if ( Array.isArray( stored ) && stored.every( ( searchEngine ) => searchEngine && typeof searchEngine.name === 'string' && typeof searchEngine.url === 'string' ) ) {
			return stored;
		}
	} catch {
	}
	return cloneSearchEngines( DEFAULT_SEARCH_ENGINES );
}

document.addEventListener( 'DOMContentLoaded', () => {
	let searchEngines = loadSearchEngines();
	let draftSearchEngines = [];
	const searchQuery = new URLSearchParams( window.location.search ).get( 'q' ) || '';
	const settingsDialog = document.getElementById( 'settings-dialog' );
	const settingsForm = document.getElementById( 'search-engine-settings-form' );
	const searchEngineList = document.getElementById( 'search-engine-list' );

	function renderSearchEngines() {
		searchEngineList.replaceChildren();
		draftSearchEngines.forEach( ( searchEngine, index ) => {
			const row = document.createElement( 'div' );
			row.className = 'search-engine-row';
			row.dataset.index = index;

			const dragHandle = document.createElement( 'div' );
			dragHandle.className = 'search-engine-drag';
			dragHandle.draggable = true;
			dragHandle.tabIndex = 0;
			dragHandle.setAttribute( 'role', 'group' );
			dragHandle.setAttribute( 'aria-roledescription', 'drag handle' );
			dragHandle.setAttribute( 'aria-label', `Reorder ${ searchEngine.name || 'search engine' }` );
			dragHandle.title = 'Drag to reorder';
			dragHandle.innerHTML = '<i class="bi bi-grip-vertical" aria-hidden="true"></i>';

			const nameInput = document.createElement( 'input' );
			nameInput.className = 'form-control search-engine-name';
			nameInput.type = 'text';
			nameInput.required = true;
			nameInput.maxLength = 60;
			nameInput.placeholder = 'Search engine name';
			nameInput.setAttribute( 'aria-label', 'Search engine name' );
			nameInput.value = searchEngine.name;

			const urlInput = document.createElement( 'input' );
			urlInput.className = 'form-control search-engine-url';
			urlInput.type = 'url';
			urlInput.required = true;
			urlInput.placeholder = 'https://example.com/search?q=%s';
			urlInput.setAttribute( 'aria-label', 'Search engine URL with %s for the query' );
			urlInput.value = searchEngine.url;

			const deleteButton = document.createElement( 'button' );
			deleteButton.className = 'search-engine-delete';
			deleteButton.type = 'button';
			deleteButton.setAttribute( 'aria-label', `Delete ${ searchEngine.name || 'search engine' }` );
			deleteButton.title = 'Delete search engine';
			deleteButton.innerHTML = '<i class="bi bi-trash3" aria-hidden="true"></i>';

			row.append( dragHandle, nameInput, urlInput, deleteButton );
			searchEngineList.append( row );
		} );
	}

	function openSettings() {
		draftSearchEngines = cloneSearchEngines( searchEngines );
		renderSearchEngines();
		settingsDialog.showModal();
	}

	document.getElementById( 'settings-button' ).addEventListener( 'click', openSettings );
	document.getElementById( 'close-settings' ).addEventListener( 'click', () => settingsDialog.close() );
	settingsDialog.addEventListener( 'click', ( event ) => {
		if ( event.target === settingsDialog ) {
			settingsDialog.close();
		}
	} );

	document.getElementById( 'add-search-engine' ).addEventListener( 'click', () => {
		draftSearchEngines.push( { name: '', url: '' } );
		renderSearchEngines();
		searchEngineList.querySelector( '.search-engine-row:last-child .search-engine-name' ).focus();
	} );

	document.getElementById( 'restore-search-engines' ).addEventListener( 'click', () => {
		draftSearchEngines = cloneSearchEngines( DEFAULT_SEARCH_ENGINES );
		renderSearchEngines();
	} );

	searchEngineList.addEventListener( 'input', ( event ) => {
		const row = event.target.closest( '.search-engine-row' );
		if ( ! row ) {
			return;
		}
		const searchEngine = draftSearchEngines[ Number( row.dataset.index ) ];
		searchEngine[ event.target.classList.contains( 'search-engine-name' ) ? 'name' : 'url' ] = event.target.value;
		if ( event.target.classList.contains( 'search-engine-url' ) ) {
			event.target.setCustomValidity( '' );
		}
		if ( event.target.classList.contains( 'search-engine-name' ) ) {
			row.querySelector( '.search-engine-drag' ).setAttribute( 'aria-label', `Reorder ${ event.target.value || 'search engine' }` );
			row.querySelector( '.search-engine-delete' ).setAttribute( 'aria-label', `Delete ${ event.target.value || 'search engine' }` );
		}
	} );

	searchEngineList.addEventListener( 'click', ( event ) => {
		const deleteButton = event.target.closest( '.search-engine-delete' );
		if ( ! deleteButton ) {
			return;
		}
		draftSearchEngines.splice( Number( deleteButton.closest( '.search-engine-row' ).dataset.index ), 1 );
		renderSearchEngines();
	} );

	searchEngineList.addEventListener( 'dragstart', ( event ) => {
		const handle = event.target.closest( '.search-engine-drag' );
		if ( ! handle ) {
			event.preventDefault();
			return;
		}
		const row = handle.closest( '.search-engine-row' );
		event.dataTransfer.setData( 'text/plain', row.dataset.index );
		event.dataTransfer.effectAllowed = 'move';
		row.classList.add( 'is-dragging' );
	} );

	searchEngineList.addEventListener( 'keydown', ( event ) => {
		const handle = event.target.closest( '.search-engine-drag' );
		if ( ! handle || ! [ 'ArrowUp', 'ArrowDown' ].includes( event.key ) ) {
			return;
		}
		const fromIndex = Number( handle.closest( '.search-engine-row' ).dataset.index );
		const toIndex = fromIndex + ( event.key === 'ArrowDown' ? 1 : -1 );
		if ( toIndex < 0 || toIndex >= draftSearchEngines.length ) {
			return;
		}
		event.preventDefault();
		const [ movedSearchEngine ] = draftSearchEngines.splice( fromIndex, 1 );
		draftSearchEngines.splice( toIndex, 0, movedSearchEngine );
		renderSearchEngines();
		searchEngineList.querySelector( `.search-engine-row[data-index="${ toIndex }"] .search-engine-drag` ).focus();
	} );

	searchEngineList.addEventListener( 'dragover', ( event ) => {
		const row = event.target.closest( '.search-engine-row' );
		if ( row ) {
			event.preventDefault();
			row.classList.add( 'is-drop-target' );
		}
	} );

	searchEngineList.addEventListener( 'dragleave', ( event ) => {
		const row = event.target.closest( '.search-engine-row' );
		if ( row && ! row.contains( event.relatedTarget ) ) {
			row.classList.remove( 'is-drop-target' );
		}
	} );

	searchEngineList.addEventListener( 'drop', ( event ) => {
		const targetRow = event.target.closest( '.search-engine-row' );
		if ( ! targetRow ) {
			return;
		}
		event.preventDefault();
		const fromIndex = Number( event.dataTransfer.getData( 'text/plain' ) );
		const toIndex = Number( targetRow.dataset.index );
		if ( fromIndex !== toIndex && Number.isInteger( fromIndex ) && draftSearchEngines[ fromIndex ] ) {
			const [ movedSearchEngine ] = draftSearchEngines.splice( fromIndex, 1 );
			draftSearchEngines.splice( toIndex, 0, movedSearchEngine );
			renderSearchEngines();
		}
	} );

	searchEngineList.addEventListener( 'dragend', () => {
		searchEngineList.querySelectorAll( '.is-dragging, .is-drop-target' ).forEach( ( row ) => {
			row.classList.remove( 'is-dragging', 'is-drop-target' );
		} );
	} );

	settingsForm.addEventListener( 'submit', ( event ) => {
		event.preventDefault();
		const urlInputs = searchEngineList.querySelectorAll( '.search-engine-url' );
		for ( const input of urlInputs ) {
			const url = input.value.trim();
			let validationMessage = '';
			try {
				const parsedUrl = new URL( url.replaceAll( '%s', 'search' ) );
				if ( ! url.includes( '%s' ) || ! [ 'http:', 'https:' ].includes( parsedUrl.protocol ) ) {
					validationMessage = 'Use an http(s) URL containing %s for the search query.';
				}
			} catch ( error ) {
				validationMessage = 'Enter a valid http(s) URL containing %s for the search query.';
			}
			input.setCustomValidity( validationMessage );
			if ( validationMessage ) {
				input.reportValidity();
				return;
			}
		}

		const nameInput = searchEngineList.querySelector( '.search-engine-name:invalid' );
		if ( nameInput ) {
			nameInput.reportValidity();
			return;
		}

		searchEngines = draftSearchEngines.map( ( searchEngine ) => ( { name: searchEngine.name.trim(), url: searchEngine.url.trim() } ) );
		try {
			localStorage.setItem( STORAGE_KEY, JSON.stringify( searchEngines ) );
		} catch {
			window.alert( 'Could not save settings in this browser.' );
			return;
		}
		settingsDialog.close();
	} );

	if ( searchQuery ) {
		const encodedQuery = encodeURIComponent( searchQuery );
		searchEngines.forEach( ( searchEngine, index ) => {
			const destination = searchEngine.url.replaceAll( '%s', encodedQuery );
			window.open( destination, index === 0 ? '_self' : '_blank' );
		} );
	}
});