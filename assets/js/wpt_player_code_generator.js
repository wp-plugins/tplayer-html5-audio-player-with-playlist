jQuery(document).ready(function($){
	$('body').delegate( ".wpt_player_browse_song", "click", function() {
		var send_attachment_bkp = wp.media.editor.send.attachment;
		var button = $(this);
		var input= $(this).parent().find('.sng_url');
		var urlIcon= $(this).parent().find('.fa-link');
		var ttl_sng_1= $(this).parent().find('.ttl_sng');
		var artst_nm_sng= $(this).parent().find('.artst_nm_sng');
		wp.media.editor.send.attachment = function(props, attachment) {
            input.val(attachment.url);
			urlIcon.css('color','#3ec3d5');
			urlIcon.children().text('Link is selected');
            ttl_sng_1.val(attachment.title);
            artst_nm_sng.val(attachment.meta.artist);
			wpt_player_change_code();
		}
		wp.media.editor.open(button);
		return false;    
	});
	
	$('body').delegate( ".wpt_player_browse_cover", "click", function() {
		var send_attachment_bkp = wp.media.editor.send.attachment;
		var button = $(this);
		var input= $(this).parent().find('.cvr_url');
		var cvrIcon= $(this).parent().find('.fa-file-image-o');
		wp.media.editor.send.attachment = function(props, attachment) {
			cvrIcon.css('color','#3ec3d5');
			cvrIcon.children().text('Cover is selected');
            input.val(attachment.url);
			wpt_player_change_code();
		}
		wp.media.editor.open(button);
		return false;    
	});
	
	count=1;
	fa_link=$('.fa-link>div').text();
	fa_image=$('.fa-file-image-o>div').text();
	
	$('body').delegate( ".fa-times", "click", function() {
		$(this).parent().parent().remove();
		wpt_player_change_code();
	});
	$('#wpt_player_add_item').click(function(){
		wpt_player_brws_cvr=$('.wpt_player_browse_cover').val();
		wpt_player_brws_sng=$('.wpt_player_browse_song').val();
		wpt_player_brws_sng=$('.wpt_player_browse_song').val();
		count++;
		wpt_player_code='<li draggable="true" data-id="'+count+'"><input type="text" class="regular-text artst_nm_sng wpt_player_change" id="artst_nm_sng_'+count+'" placeholder="Artist Name"><input type="text" class="regular-text ttl_sng wpt_player_change" id="ttl_sng_'+count+'" placeholder="Song Title"><input type="button" name="wpt_player_browse_song" class="button wpt_player_browse_song" value="'+wpt_player_brws_sng+'"><input type="hidden" name="sng_'+count+'_url" id="sng_'+count+'_url" class="sng_url wpt_player_change" value=""><input type="button" name="wpt_player_browse_cover" class="button wpt_player_browse_cover" value="'+wpt_player_brws_cvr+'"><input type="hidden" name="sng_'+count+'_cvr" id="sng_'+count+'_cvr" class="cvr_url wpt_player_change" value=""><div class="icon"><i class="fa fa-link"><div>'+fa_link+'</div></i><i class="fa fa-file-image-o"><div>'+fa_image+'</div></i><i class="fa fa-times"></i></div></li>';
		$("#wpt_tplayer_list").append(wpt_player_code);
	});
	
	function sortable(rootEl, onUpdate){
    var dragEl;
    
    // Делаем всех детей перетаскиваемыми
    [].slice.call(rootEl.children).forEach(function (itemEl){
        itemEl.draggable = true;
    });
    
    // Фнукция отвечающая за сортировку
    function _onDragOver(evt){
        evt.preventDefault();
        evt.dataTransfer.dropEffect = 'move';
       
        var target = evt.target;
        if( target && target !== dragEl && target.nodeName == 'LI' ){
            // Сортируем
            rootEl.insertBefore(dragEl, target.nextSibling || target);
        }
    }
    
    // Окончание сортировки
    function _onDragEnd(evt){
        evt.preventDefault();
       
        dragEl.classList.remove('ghost');
        rootEl.removeEventListener('dragover', _onDragOver, false);
        rootEl.removeEventListener('dragend', _onDragEnd, false);

        // Сообщаем об окончании сортировки
        onUpdate(dragEl);
    }
    
    // Начало сортировки
    rootEl.addEventListener('dragstart', function (evt){
        dragEl = evt.target; // Запоминаем элемент который будет перемещать
        
        // Ограничиваем тип перетаскивания
        evt.dataTransfer.effectAllowed = 'move';
        evt.dataTransfer.setData('Text', dragEl.textContent);

        // Пописываемся на события при dnd
        rootEl.addEventListener('dragover', _onDragOver, false);
        rootEl.addEventListener('dragend', _onDragEnd, false);

        setTimeout(function (){
            // Если выполнить данное действие без setTimeout, то
            // перетаскиваемый объект, будет иметь этот класс.
            dragEl.classList.add('ghost');
        }, 0)
    }, false);
}
           
// Используем                    
	sortable( document.getElementById('wpt_tplayer_list'), function (item){
		wpt_player_change_code();
	});
	
	function wpt_player_change_code(){
		wpt_player_list_items=$('#wpt_tplayer_list>li').length;
		var wpt_player_code = [];
		
		for (i=1;i<=wpt_player_list_items;i++){
			wpt_player_id=$('#wpt_tplayer_list>li:nth-child('+i+')').attr('data-id');
			wpt_player_url=$('#sng_'+wpt_player_id+'_url').val();
			wpt_player_cvr=$('#sng_'+wpt_player_id+'_cvr').val();
			wpt_player_ttl=$('#ttl_sng_'+wpt_player_id).val();
			wpt_player_artst=$('#artst_nm_sng_'+wpt_player_id).val();
			wpt_player_code['sng_'+i] = '[tsong url="'+wpt_player_url+'" cover="'+wpt_player_cvr+'"]'+wpt_player_artst+' – '+wpt_player_ttl+'[/tsong]<br>';
		}

		if($('#wpt_player_pls').attr("checked")){
			wpt_player_shwpls=true;
		} else {
			wpt_player_shwpls=false;
		}
		string='[tplayer]<br>[tplaylist show="'+wpt_player_shwpls+'"]<br>';
				
		for (i=1;i<=wpt_player_list_items;i++){
			string=string+wpt_player_code['sng_'+i];
		}
		
		string=string+'[/tplaylist]<br>[/tplayer]';
		$('#wpt_player_code_wrapper').html(string).addClass('fadeIn');
		
		setTimeout(function(){
			$('#wpt_player_code_wrapper').removeClass('fadeIn');
		},500)
	}
	
	$('body').delegate( ".wpt_player_change", "change", function() {
		wpt_player_change_code();
	})
});