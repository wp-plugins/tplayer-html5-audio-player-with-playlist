(function() {
	tinymce.PluginManager.add('wpt_player_button', function( editor, url ) { // id кнопки tplayer_button должен быть везде один и тот же
		editor.addButton( 'wpt_player_button', { // id кнопки tplayer_button
			icon: 'tplayer', // мой собственный CSS класс, благодаря которому я задам иконку кнопки
			type: 'menubutton',
			title: 'Add tPlayer', // всплывающая подсказка при наведении
			menu: [ // тут начинается первый выпадающий список
				{ // второй элемент первого выпадающего списка, просто вставляет [misha]
					text: 'tPlayer (required)',
					onclick: function() {
						editor.windowManager.open( {
									title: 'Set the parameters of the player',
									body: [
										{
											type: 'listbox', // тип listbox = выпадающий список select
											name: 'show_pls',
											label: 'Show Playlist...',
											'values': [ // значения выпадающего списка
												{text: 'Yes', value: 'true'}, // лейбл, значение
												{text: 'No', value: 'false'}
											]
										},
										{
											type: 'textbox', // тип textbox = текстовое поле
											name: 'song_artist',
											label: 'Song Artist',
											value: '',
											multiline: false, // большое текстовое поле - textarea
											minWidth: 300,
										},
										{
											type: 'textbox', // тип textbox = текстовое поле
											name: 'song_name',
											label: 'Song Name',
											value: '',
											multiline: false, // большое текстовое поле - textarea
											minWidth: 300,
										},
										{
											type: 'textbox', // тип textbox = текстовое поле
											name: 'song_url',
											label: 'Song URL',
											value: '',
											multiline: false, // большое текстовое поле - textarea
											minWidth: 300,
										},
										{
											type: 'textbox', // тип textbox = текстовое поле
											name: 'cover_url',
											label: 'Cover URL',
											value: '',
											multiline: false, // большое текстовое поле - textarea
											minWidth: 300,
										}
										
									],
									onsubmit: function( e ) { // это будет происходить после заполнения полей и нажатии кнопки отправки
										editor.insertContent( '[tplayer]<br>[tplaylist show="' + e.data.show_pls + '"]<br>[tsong url="' + e.data.song_url + '" cover="' + e.data.cover_url + '"]' + e.data.song_artist + ' – ' + e.data.song_name + '[/tsong]<br>[/tplaylist]<br>[/tplayer]');
									}
								});
					}
				},
				{ // второй элемент первого выпадающего списка, просто вставляет [misha]
					text: 'Add another Song (optional)',
					onclick: function() {
						editor.windowManager.open( {
									title: 'Set the parameters of the player',
									body: [
										{
											type: 'textbox', // тип textbox = текстовое поле
											name: 'song_artist',
											label: 'Song Artist',
											value: '',
											multiline: false, // большое текстовое поле - textarea
											minWidth: 300,
										},
										{
											type: 'textbox', // тип textbox = текстовое поле
											name: 'song_name',
											label: 'Song Name',
											value: '',
											multiline: false, // большое текстовое поле - textarea
											minWidth: 300,
										},
										{
											type: 'textbox', // тип textbox = текстовое поле
											name: 'song_url',
											label: 'Song URL',
											value: '',
											multiline: false, // большое текстовое поле - textarea
											minWidth: 300,
										},
										{
											type: 'textbox', // тип textbox = текстовое поле
											name: 'cover_url',
											label: 'Cover URL',
											value: '',
											multiline: false, // большое текстовое поле - textarea
											minWidth: 300,
										}
										
									],
									onsubmit: function( e ) { // это будет происходить после заполнения полей и нажатии кнопки отправки
										editor.insertContent( '[tsong url="' + e.data.song_url + '" cover="' + e.data.cover_url + '"]' + e.data.song_artist + ' – ' + e.data.song_name + '[/tsong]<br>');
									}
								});
					}
				}
			]
		});
	});
})();