import { UIPanel, UIRow } from '../../libs/ui.js';

function showVideo() {

	document.getElementById( 'text-instruction' ).style.display = 'none';
	document.getElementById( 'video-instruction' ).style.display = 'block';
	document.getElementById( 'video-show' ).style.display = 'none';
	document.getElementById( 'video-close' ).style.display = 'block';

}

function closeVideo() {

	document.getElementById( 'text-instruction' ).style.display = 'flex';
	document.getElementById( 'video-instruction' ).style.display = 'none';
	document.getElementById( 'video-show' ).style.display = 'block';
	document.getElementById( 'video-close' ).style.display = 'none';

}

function hidePopup() {

	document.getElementById( 'modal-import-to-mywebar' ).style.display = 'none';
	document.getElementById( 'modal' ).style.display = 'none';

	closeVideo();

}

function ExportToWebAR( editor ) {

	var strings = editor.strings;

	var container = new UIPanel();
	container.setClass( 'modal-import-to-mywebar' );
	container.setId( 'modal-import-to-mywebar' );

	var elem = new UIPanel();
	elem.setClass( 'content-modal-box-to' );

	var instruction = new UIRow();
	instruction.setClass( 'option instruction-object' );

	var text_head = new UIRow();
	text_head.setClass( 'option head-instruction' );
	text_head.setTextContent( strings.getKey( 'modal/text/head' ) );

	var text_instruction_block = new UIRow();
	text_instruction_block.setClass( 'option text-instruction' );
	text_instruction_block.setId( 'text-instruction' );

	var elem_instruction_1 = new UIRow();
	elem_instruction_1.setClass( 'option elem-text-instruction' );

	var step_1 = new UIRow();
	step_1.setClass( 'option step-text-instruction' );
	step_1.setTextContent( strings.getKey( 'modal/text/step/1' ) );

	var main_text_1 = new UIRow();
	main_text_1.setClass( 'option main-text-instruction' );
	main_text_1.setTextContent( strings.getKey( 'modal/text/main/1' ) );

	elem_instruction_1.add( step_1 );
	elem_instruction_1.add( main_text_1 );

	var elem_instruction_2 = new UIRow();
	elem_instruction_2.setClass( 'option elem-text-instruction' );

	var step_2 = new UIRow();
	step_2.setClass( 'option step-text-instruction' );
	step_2.setTextContent( strings.getKey( 'modal/text/step/2' ) );

	var main_text_2 = new UIRow();
	main_text_2.setClass( 'option main-text-instruction' );
	main_text_2.setTextContent( strings.getKey( 'modal/text/main/2' ) );

	elem_instruction_2.add( step_2 );
	elem_instruction_2.add( main_text_2 );

	var elem_instruction_3 = new UIRow();
	elem_instruction_3.setClass( 'option elem-text-instruction' );

	var step_3 = new UIRow();
	step_3.setClass( 'option step-text-instruction' );
	step_3.setTextContent( strings.getKey( 'modal/text/step/3' ) );

	var main_text_3 = new UIRow();
	main_text_3.setClass( 'option main-text-instruction' );
	main_text_3.setTextContent( strings.getKey( 'modal/text/main/3' ) );

	elem_instruction_3.add( step_3 );
	elem_instruction_3.add( main_text_3 );

	var elem_instruction_4 = new UIRow();
	elem_instruction_4.setClass( 'option elem-text-instruction' );

	var main_text_4 = new UIRow();
	main_text_4.setClass( 'option main-text-instruction' );
	main_text_4.dom.innerHTML = `${ strings.getKey( 'modal/text/url' ) } <a href="mailto:hello@mywebar.com">hello@mywebar.com.</a>`;

	elem_instruction_4.add( main_text_4 );

	var videoUrl = '/editor/static/video/Tutorial.mp4';
	var videoUrlProd = '/mae/editor/static/video/Tutorial.mp4';


	var video = new UIRow();
	video.setClass( 'option video-instruction' );
	video.setId( 'video-instruction' );
	video.dom.innerHTML = `
		<video style="
				width: 100%;
				height: 100%;
			"
			controls="controls"
		>
			<source src="${videoUrl}">
		</video>
	`;

	text_instruction_block.add( elem_instruction_1 );
	text_instruction_block.add( elem_instruction_2 );
	text_instruction_block.add( elem_instruction_3 );
	text_instruction_block.add( elem_instruction_4 );

	var video_button_wrapper = new UIRow();
	video_button_wrapper.setClass( 'option video-instruction-wrapper' );

	var video_instruction = new UIRow();
	video_instruction.setClass( 'option video-instruction-button btn-webar' );
	video_instruction.setId( 'video-show' );
	video_instruction.setTextContent( strings.getKey( 'modal/text/button/show' ) );
	video_instruction.onClick( function () {

		showVideo();

	} );

	var video_close = new UIRow();
	video_close.setClass( 'option video-instruction-button' );
	video_close.setId( 'video-close' );
	video_close.setTextContent( strings.getKey( 'modal/text/button/back' ) );
	video_close.onClick( function () {

		closeVideo();

	} );

	var hide_popup = new UIRow();
	hide_popup.setClass( 'option btn-hide-popup btn-webar' );
	hide_popup.setId( 'btn-hide-popup' );
	hide_popup.setTextContent( strings.getKey( 'modal/text/button/close' ) );
	hide_popup.onClick( function () {

		hidePopup();

	} );

	video_button_wrapper.add( video_instruction );
	video_button_wrapper.add( video_close );
	video_button_wrapper.add( hide_popup );

	instruction.add( text_head );
	instruction.add( text_instruction_block );
	instruction.add( video );
	instruction.add( video_button_wrapper );

	elem.add( instruction );
	container.add( elem );

	return container;

}

export { ExportToWebAR };
