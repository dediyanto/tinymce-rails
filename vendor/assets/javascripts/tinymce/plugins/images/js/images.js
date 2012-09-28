
var ImagesDialog = {
	init : function(ed) {
		tinyMCEPopup.resizeToInnerSize();
	},

	insert : function(text) {
		var ed = tinyMCEPopup.editor, dom = ed.dom;
		tinyMCEPopup.execCommand('mceInsertContent', false, text);
		//tinyMCEPopup.close();
	}
};

tinyMCEPopup.onInit.add(ImagesDialog.init, ImagesDialog);


$(function(){
	
	//ÐÐÐÐ Ð£ÐÐÐ
	$('#loader').show();
	//Ð¡ÑÑÐ¾ÐºÐ° Ð°Ð´ÑÐµÑÐ°
	$.ajax({
		type: "POST",
		url: "connector/php/",
		data: "action=showpath&type=images&path=&default=1",
		success: function(data){
			$('#addr').html(data);
		}
	});
	//ÐÐ°ÑÐ°Ð»Ð¾Ð³ Ð¿Ð°Ð¿Ð¾Ðº
	$.ajax({
		type: "POST",
		url: "connector/php/",
		data: "action=showtree&default=1",
		success: function(data){
			$('#tree').html(data);
		}
	});
	//Ð¡Ð¿Ð¸ÑÐ¾Ðº ÑÐ°Ð¹Ð»Ð¾Ð²
	$.ajax({
		type: "POST",
		url: "connector/php/",
		data: "action=showdir&pathtype=images&path=&default=1",
		success: function(data){
			$('#loader').hide();
			//$('#files').html(data);
			$('#mainFiles').html('<div id="files">'+data+'</div>');
			showFootInfo();
		}
	});
	//Session ID Ð´Ð»Ñ Flash-Ð·Ð°Ð³ÑÑÐ·ÑÐ¸ÐºÐ°
	var SID;
	$.ajax({
		type: "POST",
		url: "connector/php/",
		data: "action=SID",
		success: function(data){
			SID = data;
		}
	});
	
	
	//ÐÐ´ÑÐµÑÐ½Ð°Ñ ÑÑÑÐ¾ÐºÐ°
	$('.addrItem div,.addrItem img').live('mouseover', function(){
		$(this).parent().animate({backgroundColor:'#b1d3fa'}, 100, 'swing', function(){
			
		});
	});
	$('.addrItem div,.addrItem img').live('mouseout', function(){
		$(this).parent().animate({backgroundColor:'#e4eaf1'}, 200, 'linear', function(){
			//alert('ck');
			$(this).css({'background-color':'transparent'});
			//alert('ck');
		});
	});
	$('.addrItem div,.addrItem img').live('mousedown', function(){
		$(this).parent().css({'background-color':'#679ad3'});
	});
	$('.addrItem div,.addrItem img').live('mouseup', function(){
		$(this).parent().css({'background-color':'#b1d3fa'});
		$.ajax({
			type: "POST",
			url: "connector/php/",
			data: "action=showtree&path="+$(this).parent().attr('path')+"&type="+$(this).parent().attr('pathtype'),
			success: function(data){
				//$('#loader').hide();
				$('#tree').html(data);
			}
		});
		$.ajax({
			type: "POST",
			url: "connector/php/",
			data: "action=showpath&type="+$(this).parent().attr('pathtype')+"&path="+$(this).parent().attr('path'),
			success: function(data){
				$('#addr').html(data);
			}
		});
		$.ajax({
			type: "POST",
			url: "connector/php/",
			data: "action=showdir&pathtype="+$(this).parent().attr('pathtype')+"&path="+$(this).parent().attr('path'),
			success: function(data){
				$('#loader').hide();
				//$('#files').html(data);
				$('#mainFiles').html('<div id="files">'+data+'</div>');
				showFootInfo();
			}
		});
	});
	
	//ÐÐ½Ð¾Ð¿ÐºÐ° "Ð Ð½Ð°ÑÐ°Ð»Ð¾"
	$('#toBeginBtn').mouseover(function(){
		$(this).children(0).attr('src','img/backActive.gif');
	});
	$('#toBeginBtn').mouseout(function(){
		$(this).children(0).attr('src','img/backEnabled.gif');
	});
	
	//ÐÐµÐ½Ñ
	$('.folderClosed,.folderOpened,.folderS,.folderImages,.folderFiles').live('mouseover',function(){
		if(!$(this).hasClass('folderAct')) {
			$(this).addClass('folderHover');
		} else {
			$(this).addClass('folderActHover');
		}
	});
	$('.folderClosed,.folderOpened,.folderS,.folderImages,.folderFiles').live('mouseout',function(){
		if(!$(this).hasClass('folderAct')) {
			$(this).removeClass('folderHover');
		} else {
			$(this).removeClass('folderActHover');
		}
	});
	
	//Ð¤Ð»Ð°Ð³ Ð·Ð°Ð³ÑÑÐ·ÐºÐ¸
	var folderLoadFlag = false;
	//ÐÑÐºÑÑÑÑ ÑÐºÐ°Ð·Ð°Ð½Ð½ÑÑ Ð¿Ð°Ð¿ÐºÑ
	function openFolder(type, path, callback) {
		$.ajax({
			type: "POST",
			url: "connector/php/",
			data: "action=showpath&type="+type+"&path="+path,
			success: function(data){
				$('#addr').html(data);
			}
		});
		$.ajax({
			type: "POST",
			url: "connector/php/",
			data: "action=showdir&pathtype="+type+"&path="+path,
			success: function(data){
				$('#loader').hide();
				//$('#files').html(data);
				$('#mainFiles').html('<div id="files">'+data+'</div>');
				showFootInfo();
				callback();
			}
		});
	}
	$('.folderClosed,.folderOpened,.folderS,.folderImages,.folderFiles').live('click',function(){
		
		//ÐÐ°Ð¿ÑÐµÑ Ð½Ð° Ð¿ÐµÑÐµÐºÐ»ÑÑÐµÐ½Ð¸Ðµ
		if(folderLoadFlag) return false;
		folderLoadFlag = true;
		
		$('#loader').show();
		$('.folderAct').removeClass('folderAct');
		$(this).removeClass('folderHover');
		$(this).addClass('folderAct');
			
		openFolder($(this).attr('pathtype'), $(this).attr('path'), function(){ folderLoadFlag = false; });
	});
	$('.folderImages,.folderFiles').live('dblclick',function(){
		$(this).next().slideToggle('normal');
	});
	$('.folderOpened,.folderS').live('dblclick',function(){
		if(!$(this).next().hasClass('folderOpenSection')) return false;
		if($(this).hasClass('folderS')) {
			$(this).removeClass('folderS').addClass('folderOpened');
		} else {
			$(this).removeClass('folderOpened').addClass('folderS');
		}
		$(this).next().slideToggle('normal');
	});
	
	//ÐÐÐÐ¡Ð¢ÐÐÐ¯ ÐÐÐÐ®
	//ÐÑÐºÑÑÑÑ Ð·Ð°Ð³ÑÑÐ·ÑÐ¸Ðº ÑÐ°Ð¹Ð»Ð¾Ð²
	$('#menuUploadFiles').click(function(){
		var path = getCurrentPath();
		var str = '';
		if(path.type=='images') {
			str = '<span>Images:</span>';
		} else if(path.type=='files') {
			str = '<span>Files:</span>';
		}
		str += path.path;
		$('#uploadTarget').html(str);
		
		$('#normalPathVal').val(path.path);
		$('#normalPathtypeVal').val(path.type);
		
		$('#upload').show();
	});
	//Ð¡Ð¾Ð·Ð´Ð°ÑÑ Ð¿Ð°Ð¿ÐºÑ
	var canCancelFolder = true;
	$('#menuCreateFolder').click(function(){
		$(this).hide();
		$('#menuCancelFolder,#menuSaveFolder').show();
		
		$('.folderAct').after('<div id="newFolderBlock"><input type="text" name="newfolder" id="newFolder" /></div>');
		$('#newFolderBlock').slideDown('fast', function(){
			$('#newFolderBlock input').focus().blur(cancelNewFolder).keypress(function(e){
				if(e.which == 13) {
					saveNewFolder();
				} else if (e.which == 27) {
					cancelNewFolder();
				} else if ((e.which >= 97 && e.which <= 122) || (e.which >= 65 && e.which <= 90) || (e.which >= 48 && e.which <= 57) || e.which == 8 || e.which == 95 || e.which == 45 || e.keyCode == 37 || e.keyCode == 39 || e.keyCode == 16) {
					//ÐÐ½Ð°ÑÐ¸Ñ Ð²ÑÐµ Ð²ÐµÑÐ½Ð¾: a-Z0-9-_ Ð¸ ÑÐ¿ÑÐ°Ð²Ð»ÐµÐ½Ð¸Ðµ Ð²Ð²Ð¾Ð´Ð¾Ð¼
				} else {
					return false;
				}
				
			});
		});
		
	});
	//ÐÑÐ¼ÐµÐ½Ð¸ÑÑ ÑÐ¾Ð·Ð´Ð°Ð½Ð¸Ðµ Ð¿Ð°Ð¿ÐºÐ¸
	function cancelNewFolder(){
		if(!canCancelFolder) {
			canCancelFolder = true;
			return false;
		}
		$('#menuCancelFolder,#menuSaveFolder').hide();
		$('#menuCreateFolder').show();
		
		$('#newFolderBlock').slideUp('fast', function(){
			$(this).remove();
		});
	}
	$('#menuCancelFolder').click(cancelNewFolder);
	
	//ÐÐ¾Ð´ÑÐ²ÐµÑÐ´Ð¸ÑÑ ÑÐ¾Ð·Ð´Ð°Ð½Ð¸Ðµ Ð¿Ð°Ð¿ÐºÐ¸
	function saveNewFolder(){
		canCancelFolder = false;
		
		if($('#newFolderBlock input').val() == '') {
			alert('Enter a name for new folder');
			$('#newFolderBlock input').focus();
			return false;
		}
		
		$('#loader').show();
		$('#menuCancelFolder,#menuSaveFolder').hide();
		$('#menuCreateFolder').show();
		//ÐÐ°Ð¿ÑÐ¾Ñ Ð½Ð° ÑÐ¾Ð·Ð´Ð°Ð½Ð¸Ðµ Ð¿Ð°Ð¿ÐºÐ¸ + ÑÐµÑÐ²ÐµÑ Ð´Ð¾Ð»Ð¶ÐµÐ½ Ð¾ÑÐ´Ð°ÑÑ Ð½Ð¾Ð²ÑÑ ÑÑÑÑÐºÑÑÑÑ ÐºÐ°ÑÐ°Ð»Ð¾Ð³Ð¾Ð²
		var pathtype = $('.folderAct').attr('pathtype');
		var path = $('.folderAct').attr('path');
		var path_new = $('#newFolderBlock input').val();
		var path_will = path+'/'+path_new;
		$.ajax({
			type: "POST",
			url: "connector/php/",
			data: "action=newfolder&type="+ pathtype +"&path="+ path +"&name=" + path_new,
			success: function(data){
				$('#loader').hide();
				var blocks = eval('('+data+')');
				if(blocks.error != '') {
					alert(blocks.error);
					$('#newFolderBlock input').focus();
				} else {
					$('#tree').html(blocks.tree);
					$('#addr').html(blocks.addr);
					canCancelFolder = true;
					
					//ÐÑÐºÑÑÐ²Ð°ÐµÐ¼ ÑÐ¾Ð·Ð´Ð°Ð½Ð½ÑÑ Ð¿Ð°Ð¿ÐºÑ
					$.ajax({
						type: "POST",
						url: "connector/php/",
						data: "action=showdir&pathtype="+pathtype+"&path="+$('.folderAct').attr('path'),
						success: function(data){
							$('#loader').hide();
							//$('#files').html(data);
							$('#mainFiles').html('<div id="files">'+data+'</div>');
						}
					});
				}
			}
		});
	}
	$('#menuSaveFolder').click(saveNewFolder).hover(function(){ canCancelFolder = false; }, function(){ canCancelFolder = true; });
	
	//Ð£Ð´Ð°Ð»Ð¸ÑÑ Ð¿Ð°Ð¿ÐºÑ
	$('#menuDelFolder').click(function() {
		var path = getCurrentPath();
		if(confirm('Delete folder '+path.path+'?')) {
			$('#loader').show();
			$.ajax({
				type: "POST",
				url: "connector/php/",
				data: "action=delfolder&pathtype="+path.type+"&path="+path.path,
				success: function(data){
					var result = eval('('+data+')');
					if(typeof(result.error) != 'undefined') {
						$('#loader').hide();
						alert(result.error);
					} else {
						//$('#mainFiles').html('<div id="files">'+result.ok+'</div>');
						//showFootInfo();
						$.ajax({
							type: "POST",
							url: "connector/php/",
							data: "action=showtree&path=&type="+path.type,
							success: function(data){
								//$('#loader').hide();
								$('#tree').html(data);
							}
						});
						openFolder(path.type, '', function(){ $('#loader').hide(); });
						
					}
					
				}
			});
		}
	});
	
	//Ð£Ð´Ð°Ð»Ð¸ÑÑ ÑÐ°Ð¹Ð»Ñ
	$('#menuDelFiles').click(function() {
		var files = $('.imageBlockAct');
		
		if(files.length == 0) {
			alert('Select files to delete.\n\nYou can select multiple files at once, so hold Ctrl while selecting.');
		} else if(files.length == 1) {
			if(confirm('Delete file '+files.attr('fname')+'.'+files.attr('ext')+'?')) {
				$('#loader').show();
				var path = getCurrentPath();
				$.ajax({
					type: "POST",
					url: "connector/php/",
					data: "action=delfile&pathtype="+path.type+"&path="+path.path+"&md5="+files.attr('md5')+"&filename="+files.attr('filename'),
					success: function(data){
						$('#loader').hide();
						//$('#files').html(data);
						if(data != 'error') {
							$('#mainFiles').html('<div id="files">'+data+'</div>');
							showFootInfo();
						} else {
							alert(data);
						}
					}
				});
			}
		} else {
			if(confirm('Files to delete: '+files.length+'\n\nContinue?')) {
				$('#loader').show();
				var path = getCurrentPath();
				
				//Ð¡Ð¾Ð±Ð¸ÑÐ°ÐµÐ¼ ÑÑÑÐ¾ÐºÑ Ð·Ð°Ð¿ÑÐ¾ÑÐ°
				var actionStr = 'action=delfile&pathtype='+path.type+'&path='+path.path;
				$.each(files, function(i, item){
					actionStr += "&md5["+i+"]="+$(this).attr('md5')+"&filename["+i+"]="+$(this).attr('filename');
				});
				
				$.ajax({
					type: "POST",
					url: "connector/php/",
					data: actionStr,
					success: function(data){
						$('#loader').hide();
						//$('#files').html(data);
						if(data != 'error') {
							$('#mainFiles').html('<div id="files">'+data+'</div>');
							showFootInfo();
						} else {
							alert(data);
						}
					}
				});
			}
		}
	});
	
	
	//Ð¤Ð°Ð¹Ð»Ñ
	var ctrlState = false;
	$('.imageBlock0').live('mouseover', function(){
		if(!$(this).hasClass('imageBlockAct')) {
			$(this).addClass('imageBlockHover');
		} else {
			$(this).addClass('imageBlockActHover');
		}
	});
	$('.imageBlock0').live('mouseout', function(){
		if(!$(this).hasClass('imageBlockAct')) {
			$(this).removeClass('imageBlockHover');
		} else {
			$(this).removeClass('imageBlockActHover');
		}
	});
	
	$('#insertImage').click(function(){
		$('.imageBlockAct').trigger('dblclick');
		tinyMCEPopup.close();
	});
	
	$('.imageBlock0').live('dblclick', function(){
		var e = $(this);
		
		if(e.attr('type') == 'files')
		{
			var filesize = e.attr('fsizetext');
			var text = '<a href="'+e.attr('linkto')+'" '+addAttr+' title="'+e.attr('fname')+'">';
			text += e.attr('fname');
			text += '</a> ' + ' ('+filesize+') ';
		}
		else
		{
			if(e.attr('fmiddle')) {
				var addAttr = (e.attr('fclass')!=''?'class="'+e.attr('fclass')+'"':'')+' '+(e.attr('frel')!=''?'rel="'+e.attr('frel')+'"':'');
				var text = '<a href="'+e.attr('linkto')+'" '+addAttr+' title="'+e.attr('fname')+'">';
				text += '<img src="'+e.attr('fmiddle')+'" width="'+e.attr('fmiddlewidth')+'" height="'+e.attr('fmiddleheight')+'" alt="'+e.attr('fname')+'" />';
				text += '</a> ';
			} else {
				var text = '<img src="'+e.attr('linkto')+'" width="'+e.attr('fwidth')+'" height="'+e.attr('fheight')+'" alt="'+e.attr('fname')+'" /> ';
			}
		}
		
		ImagesDialog.insert(text);
		
		if($('.imageBlockAct').length == 1) {
			tinyMCEPopup.close();
		}
	});
	$('.imageBlock0').live('click', function(){
		if(ctrlState) {
			if($(this).hasClass('imageBlockActHover') || $(this).hasClass('imageBlockAct')) {
				$(this).removeClass('imageBlockAct');
				$(this).removeClass('imageBlockActHover');
			} else {
				$(this).removeClass('imageBlockHover');
				$(this).addClass('imageBlockAct');
			}
		} else {
			$('.imageBlockAct').removeClass('imageBlockAct');
			$(this).removeClass('imageBlockHover');
			$(this).addClass('imageBlockAct');
		}
		
		showFootInfo();
	});
	
	function selectAllFiles() {
		$('.imageBlock0').addClass('imageBlockAct');
		showFootInfo();
	}
	
	$(this).keydown(function(event){
		if(ctrlState && event.keyCode==65) selectAllFiles();
		if(event.keyCode==17) ctrlState = true;
	});
	$(this).keyup(function(event){
		if(event.keyCode==17) ctrlState = false;
	});
	$(this).blur(function(event){
		ctrlState = false;
	});
	
	
	
	//ÐÐÐÐÐ¯Ð¯ ÐÐÐÐÐÐ¬
	//ÐÐ¾ÐºÐ°Ð·Ð°ÑÑ ÑÐµÐºÑÑÑÑ Ð¸Ð½ÑÐ¾ÑÐ¼Ð°ÑÐ¸Ñ
	function showFootInfo() {
		$('#fileNameEdit').show();
		$('#fileNameSave').hide();
		var file = $('.imageBlockAct');
		if(file.length > 1) {
			$('#footTableName, #footDateLabel, #footLinkLabel, #footDimLabel, #footDate, #footLink, #footDim').css('visibility','hidden');
			$('#footExt').text('Files selected: '+file.length);
			var tmpSizeCount = 0;
			$.each(file, function(i, item) {
				tmpSizeCount += parseInt($(this).attr('fsize'));
			});
			$('#footSize').text(intToMb(tmpSizeCount));
		} else if(file.length == 0) {
			$('#footTableName, #footDateLabel, #footLinkLabel, #footDimLabel, #footDate, #footLink, #footDim').css('visibility','hidden');
			var allFiles = $('.imageBlock0');

			$('#footExt').text('Files: '+allFiles.length);
			var tmpSizeCount = 0;
			$.each(allFiles, function(i, item) {
				tmpSizeCount += parseInt($(this).attr('fsize'));
			});
			$('#footSize').text(intToMb(tmpSizeCount));
		} else {
			
			$('#fileName').text(file.attr('fname'));
			$('#footExt').text(file.attr('ext'));
			$('#footDate').text(file.attr('date'));
			$('#footLink a').text(file.attr('fname').substr(0,16)).attr('href',file.attr('linkto'));
			$('#footSize').text(intToMb(file.attr('fsize')));
			$('#footDim').text(file.attr('fwidth')+'x'+file.attr('fheight'));
			
			$('#footTableName, #footDateLabel, #footLinkLabel, #footDimLabel, #footDate, #footLink, #footDim').css('visibility','visible');
		}
	}
	
	//ÐÑÐ¸ÑÑÐ¸ÑÑ Ð¿Ð¾Ð»Ñ Ð¸Ð½ÑÐ¾ÑÐ¼Ð°ÑÐ¸Ð¸
	
	//ÐÐ°Ð¹ÑÑ Ð² ÐÐ± Ð¸ ÐÐ±
	function intToMb(i) {
		if(i < 1024) {
			return i + ' b';
		} else if(i < 1048576) {
			var v = i/1024;
			v = parseInt(v*10)/10;
			return v + ' kb';
		} else {
			var v = i/1048576;
			v = parseInt(v*10)/10;
			return v + ' Mb';
		}
	}
	
	//Ð ÐµÐ´Ð°ÐºÑÐ¸ÑÐ¾Ð²Ð°ÑÑ Ð¸Ð¼Ñ
	$('#fileNameEdit').click(function(){
		$('#fileName').html('<input type="text" name="fileName" id="fileNameValue" value="'+$('#fileName').html()+'" />');
		$('#fileNameValue').focus();
		$('#fileNameEdit').hide();
		$('#fileNameSave').show();
	});
	//Ð¡Ð¾ÑÑÐ°Ð½Ð¸ÑÑ Ð¸Ð¼Ñ
	$('#fileNameSave').click(function(){
		$('#loader').show();
		
		//ÐÐ°Ð¿ÑÐ¾Ñ
		//$('.imageBlockAct').attr('filename')
		var path = getCurrentPath();
		var newname = $('#fileNameValue').val();
		$.ajax({
			type: "POST",
			url: "connector/php/",
			data: 'action=renamefile&path='+path.path+'&pathtype='+path.type+'&filename='+$('.imageBlockAct').attr('filename')+'&newname='+newname,
			success: function(data){
				$('#loader').hide();
				if(data != 'error') {
					$('#fileName').html(newname);
					$('.imageBlockAct').attr('fname', newname);
					$('.imageBlockAct .imageName').text(newname);
				} else {
					alert(data);
				}
			}
		});
		
		$('#fileNameSave').hide();
		$('#fileNameEdit').show();
	});
	
	
	//ÐÐµÐ½Ñ Ð·Ð°Ð³ÑÑÐ·ÑÐ¸ÐºÐ°
	$('#uploadMenu a').click(function(){
		$('#uploadMenu a').removeClass('act');
		$(this).addClass('act');
		
		if($(this).attr('id') == 'uploadAreaNormalControl') {
			$('#uploadAreaNormal').show();
			$('#uploadAreaMulti').hide();
		} else if($(this).attr('id') == 'uploadAreaMultiControl') {
			$('#uploadAreaNormal').hide();
			$('#uploadAreaMulti').show();
		}
		
		return false;
	});
	
	//ÐÐ°ÐºÑÑÑÑ Ð·Ð°Ð³ÑÑÐ·ÑÐ¸Ðº
	$('#uploadClose').click(function(){
		$('#loader').show();
		var path = getCurrentPath();
		$.ajax({
			type: "POST",
			url: "connector/php/",
			data: "action=showtree&path="+path.path+"&type="+path.type,
			success: function(data){
				//$('#loader').hide();
				$('#tree').html(data);
			}
		});
		openFolder(path.type, path.path, function(){ $('#loader').hide(); });
		
		$('#upload').hide();
		$('#divStatus').html('');
	});
	
	//ÐÐ¾Ð»ÑÑÐ¸ÑÑ ÑÐµÐºÑÑÑÑ Ð´Ð¸ÑÐµÐºÑÐ¾ÑÐ¸Ñ Ð¸ ÐµÐµ ÑÐ¸Ð¿
	function getCurrentPath() {
		var type = $('.addrItem:first').attr('pathtype');
		var path = $('.addrItemEnd').attr('path');
		
		if(!path) path = '/';
		
		return {'type':type, 'path':path};
	}
	
	//ÐÐ¾ÑÐ¼Ð°Ð»ÑÐ½Ð°Ñ Ð·Ð°Ð³ÑÑÐ·ÐºÐ°
	$('#fileOpen').MultiFile({ 
		STRING: { 
			remove:'<img src="img/cross_small.png" width="16" height="16" alt="Remove" />',
			denied:'You can not upload files with the extension $ext!',
			duplicate:'File $file already added'
		},
		max: 5,
		afterFileSelect: checkFiles,
		afterFileRemove: checkFiles
	});
	function checkFiles() {
		if($('.fileOpen').length > 1) $('#normalSubmit').show();
		else $('#normalSubmit').hide();
		
		$('#normalResult').hide();
	}
	$('#normalSubmit').click(function() {
		$('#normalLoader').show();
		$('#filesForm').ajaxSubmit({
			success: function(){
				$('#fileOpen_wrap_labels').slideUp(function(){
					$('#normalLoader').hide();
					$('#normalSubmit').hide();
					$('#normalResult').show();
					$('#filesHolder').html('<input type="file" id="fileOpen" class="fileOpen" />');
					$('#fileOpen').MultiFile({ 
						STRING: {
							remove:'<img src="img/cross_small.png" width="16" height="16" alt="Remove" />',
							denied:'You can not upload files with the extension $ext!',
							duplicate:'File $file already added'
						},
						max: 5,
						afterFileSelect: checkFiles,
						afterFileRemove: checkFiles
					});
				});
			}
		});
		
		return false;
	}); 
	
	//SWFUpload Ð·Ð°Ð³ÑÑÐ·ÐºÐ°
	swfu = new SWFUpload({
		flash_url : "js/swfupload/swfupload.swf",
		upload_url: "connector/php/index.php",	// Relative to the SWF file
		post_params: {
			//"PHPSESSID" : "NONE",
			"action" : "uploadfile"
		},
		file_size_limit : "100 MB",
		file_types : "*.*",
		file_types_description : "All files",
		file_upload_limit : 20,
		file_queue_limit : 0,
		custom_settings : {
			progressTarget : "fsUploadProgress",
			cancelButtonId : "btnCancel"
		},
		debug: false,

		// Button Settings
		button_placeholder_id : "spanButtonPlaceholder",
		button_width: 70,
		button_height: 24,
		button_window_mode: SWFUpload.WINDOW_MODE.TRANSPARENT,
		button_cursor: SWFUpload.CURSOR.HAND,

		// The event handler functions are defined in handlers.js
		swfupload_loaded_handler : function() {
			var self = this;
			clearTimeout(this.customSettings.loadingTimeout);
			document.getElementById("divLoadingContent").style.display = "none";
			document.getElementById("divLongLoading").style.display = "none";
			document.getElementById("divAlternateContent").style.display = "none";
			document.getElementById("btnCancel").onclick = function () { self.cancelQueue(); };
			
			var path = getCurrentPath();
			this.addPostParam('path', path.path);
			this.addPostParam('pathtype', path.type);
			this.addPostParam('SID', SID);
			//alert(SID);
		},
		file_queued_handler : fileQueued,
		file_queue_error_handler : fileQueueError,
		file_dialog_complete_handler : fileDialogComplete,
		upload_start_handler : uploadStart,
		upload_progress_handler : uploadProgress,
		upload_error_handler : uploadError,
		upload_success_handler : uploadSuccess,
		upload_complete_handler : uploadComplete,
		queue_complete_handler : queueComplete,	// Queue plugin event
		
		// SWFObject settings
		minimum_flash_version : "9.0.28",
		swfupload_pre_load_handler : swfUploadPreLoad,
		swfupload_load_failed_handler : swfUploadLoadFailed
	});
	
});
















