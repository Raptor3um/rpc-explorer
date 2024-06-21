const HEADERS = {
	transactions_table_headers : [
		{
			data : "TXID",
			className: "data-cell monospace",
			render : transactionHylink
		},
		{
			data : "Confirmations",
			className: "data-cell monospace"
		}
	],
	masternode_table_headers : [
		{
			data : "IP",
			className: "data-cell monospace"
		},
		{
			data : "Status",
			className: "data-cell monospace"

		},
		{
			data : "Reachable",
			className: "data-cell monospace",
			render: renderBooleanIcon
		},
		{
			data : "Collateral Address",
			className: "data-cell monospace",
			render: addressRedirectLinkWithShortHand
		},
		{
			data : "Protx Hash",
			className: "data-cell monospace",
			render: shortHandText
		},
		{
			data : "Voting Address",
			className: "data-cell monospace",
			render: addressRedirectLinkWithShortHand
		},
		{
			data : "Owner Address",
			className: "data-cell monospace",
			render: addressRedirectLinkWithShortHand
		},
		{
			data : "Payee Address",
			className: "data-cell monospace",
			render: addressRedirectLinkWithShortHand
		},
		{
			data : "Last Paid Block",
			className: "data-cell monospace"
		},
		{
			data : "Last Paid Time",
			className: "data-cell monospace"
		}
	],
	asset_table_headers : [
		{
			data : "Name",
			className: "data-cell monospace",
			render : assetInfoLink
		},
		{
			data : "Amount",
			className: "data-cell monospace"
		},
		{
			data : "Units",
			className: "data-cell monospace"
		},
		{
			data : "Reissuable",
			className: "data-cell monospace"
		},
		{
			data : "IPFS Hash",
			className: "data-cell monospace"
		}
	],
	asset_info_table_headers : [
		{
			data : "Address",
			className: "data-cell monospace",
			render : addressRedirectLink
		},
		{
			data : "Balance",
			className: "data-cell monospace"
		}
	],
	blocks_table_headers : [
		{
			data : "Height",
			className: "data-cell monospace",
			render : blockRedirect
		},
		{
			data : "Timestamp",
			className: "data-cell monospace"
		},
		{
			data : "Age",
			className: "data-cell monospace text-right"
		},
		{
			data : "Miner",
			className: "data-cell monospace",
			render : minerReference
		},
		{
			data : "Transactions",
			className: "data-cell monospace text-right"
		},
		{
			data : "Average Fee",
			className: "data-cell monospace text-right",
			render : displayFee
		},
		{
			data : "Size (bytes)",
			className: "data-cell monospace text-right"
		}
	],
	rich_list_table_headers : [
		{
			data : "Rank",
			className: "data-cell monospace text-left",
		},
		{
			data : "Address",
			className: "data-cell monospace text-left",
			render: addressRedirectLink
		},
		{
			data : "Label",
			className: "data-cell monospace text-left"
		},
		{
			data : "Balance",
			className: "data-cell monospace text-left",
		}
	],
	market_list_table_headers : [
		{
			data : "Exchange",
			className: "data-cell monospace text-left"
		},
		{
			data : "Pair",
			className: "data-cell monospace text-left",
			render: exchangeRedirectLink
		},
		{
			data : "Price",
			className: "data-cell monospace text-left"
		},
		{
			data : "Volume",
			className: "data-cell monospace text-left"
		},
		{
			data : "Change",
			className: "data-cell monospace text-left"
		}
	]
}

function renderBooleanIcon(data, type) {
		if(type === 'display'){
			var icon;
			var color;
			if(data === 'Checking') {
				icon = "fa-sync";
				color = "#F0FF33";
			} else if(data) {
				icon = "fa-check";
				color = "#008000";
			} else {
				icon = "fa-times";
				color = "#FF0000";
			}
			data = `<i class="fas ${icon} fa-lg mr-2" style="color:${color}"/>`
		}
		return data;
}

function shortHandText(text) {
	if(!text) {
		return "";
	}
	return text.length > 10 ? text.substring(0, 4) + "..." + text.substring(text.length - 4, text.length) : text;
}

function redirectLink(data, type, row, meta, baseUri) {
	if(type === 'display'){
		  var dataLink = data.replace(/,/g, "");
			data = `<a href="${baseUri}/${dataLink}" target="_blank">${data}</a>`;
	}
	return data;
}

function exchangeRedirectLink(data, type, row, meta) {
	if(type === 'display'){
			data = `<a href="${data.website}" target="_blank">${data.id}</a>`;
	}
	return data;
}

function redirectLinkWithShortHandText(data, type, row, meta, baseUri) {
	if(type === 'display'){
		  var shortHand = shortHandText(data);
			data = `<a href="${baseUri}/${data}" target="_blank">${shortHand}</a>`;
	}
	return data;
}

function infoLink(data, type, row, meta, jsFunction) {
	if(type === 'display'){
			data = `<a href=javascript:${jsFunction}("${data}")>${data}</a>`;
	}
	return data;
}

function displayWeight(data, type, row, meta) {
	if(type === 'display') {
		//data = row[Object.keys(row)[meta.col]];
		data = `
		<span> ${data.weight} </span>
		<small class="font-weight-light text-muted"> (${data.percentage}) </small>
		<div class="progress" style="height: 4px;">
			<div class="progress-bar" role="progressbar" style="width: ${data.percentage}%;" aria-valuenow=${parseInt(100 * data.weight / data.maxWeight)} aria-valuemin="0" aria-valuemax="100"/>
		</div>
		`
	}
	return data;
}

function displayFee(data, type, row, meta) {
	if(type === 'display'){
		//data = row[Object.keys(row)[meta.col]];
		var displayHtml = `<span class="monospace">${data.amount}`
		if(data.tooltip) {
			displayHtml += `<small class="border-dotted ml-1" data-toggle="tooltip" title="${data.tooltip}")> ${data.unit}</small>`
		} else if(data.unit) {
			displayHtml += `<small class="ml-1"> ${data.unit}</small>`
		}
		data = displayHtml + "</span>"
	}
	return data;
}

function minerReference(data, type, row, meta) {
	if(type === 'display'){
		if(data.identifiedBy) {
			var link = data.link ? `onclick="window.open('${data.link}', '_blank')"` : "";
			data = `<span data-toggle="tooltip" title="Identified by: ${data.identifiedBy}"
			class="rounded bg-primary text-white px-2 py-1" style="white-space: nowrap;" ${link}> ${data.name}</span>`;
		} else {
			data = `<span>${data.name ? data.name : "?"}</span>`;
		}
	}
	return data;
}

function assetInfoLink(data, type, row, meta) {
	return infoLink(data, type, row, meta, "displayAssetInfo")
}

function addressRedirectLink(data, type, row, meta){
	return redirectLink(data, type, row, meta, "address");
}

function addressRedirectLinkWithShortHand(data, type, row, meta){
	return redirectLinkWithShortHandText(data, type, row, meta, "address");
}

function transactionHylink(data, type, row, meta){
	//console.log("name=%s, data=%O, meta=%O, row=%O", row.name, data, meta, row );
	return redirectLink(data, type, row, meta, "tx");
}

function blockRedirect(data, type, row, meta){
	//console.log("name=%s, data=%O, meta=%O, row=%O", row.name, data, meta, row );
	return redirectLink(data, type, row, meta, "block-height");
}

function updateElementValue(id, value, isHTML = false) {
	var element = (id instanceof Object) ? id : $(`#${id}`);
	if(element && element.length > 0) {
		if(isHTML) {
			element.html(value);
		} else {
			element.text(value);
		}
	}
}

function updateElementAttr(id, attrName, value) {
	var element = $(`#${id}`);
	if(element && element.length > 0) {
		element.attr(attrName, value);
	}
}

function ajaxUpdate(uri, id) {
	updateElementValue(id, `<div class="spinner-border" role="status">
  													<span class="sr-only">Loading...</span>
													</div>`, true);
	uri = checkAndPadLocale(uri);
	$.ajax({url: uri, success: function(html) {
			updateElementValue(id, html, true);
		}
	});
}

function checkAndPadLocale(url) {
	var lang = currentUrlParams.lang;
	if(lang) {
		var urlParams = getUrlVars(url);
		var params = Object.keys(urlParams);
		if(params.length > 0) {
			url += "&lang=" + lang;
		} else {
			url += "?lang=" + lang;
		}
	}
	return url;
}

function loadDataToTable(id, headers, loadUrl, paging, searching, ordering) {
	loadUrl = checkAndPadLocale(loadUrl);
	if ( ! $.fn.DataTable.isDataTable(`#${id}`) ) {
		var table;
		if(paging) {
			table = $(`#${id}`).DataTable({
				serverSide: true,
				ajax : {
					url : loadUrl,
					type : "GET",
				},
				columns : headers,
				paging : true,
				processing : true,
				ordering : ordering ? ordering : false,
				searching : searching ? searching : false,
				searchDelay: 500,
				scrollX : false,
				scrollY : false,
				info : true,
				scrollCollapse: true
			});
		} else {
		  table = $(`#${id}`).DataTable({
				serverSide: true,
				ajax : {
					url : loadUrl,
					type : "GET",
					dataSrc : ""
				},
				columns : headers,
				paging : false,
				processing : true,
				ordering : ordering ? ordering : false,
				searching : searching ? searching : false,
				scrollX : false,
				scrollY : false,
				info : false,
				scrollCollapse: true
			});
		}
		table.on("draw.dt", function() {
				//table.columns.adjust();
		});
		table.on("page.dt", function() {
				//alert("page loaded");
		});
	} else {
		table = $(`#${id}`).DataTable();
		if(table.ajax.url != loadUrl) {
			table.ajax.url(loadUrl).load();
		} else {
			table.ajax.reload();
		}
	}
	/*$.ajax({url: loadUrl, success: function(data) {
			var headers = data.headers;
			var rows = data.rows;
			var linkMap = data.linkMap;
			var dataTable = $(`#${id}`).DataTable({

			});
		}
	});*/
}

function displayAssetInfo(assetName) {
	displayPopup("popup-dialog", "asset-info-table-container", assetName + " Addresses", loadAssetAddresses, assetName);
}

function loadAssetAddresses(assetName) {
	return new Promise((resolve, reject) => {
		loadDataToTable("asset-info-table",HEADERS.asset_info_table_headers, `/api/getassetaddresses?assetname=${assetName}`, true, false);
		resolve();
	});
}

function displayPopup(popupId, contentEleId, title, contentLoadFunc, ...args) {
	if(popupId) {
		var popup = $(`#${popupId}`);
		if(contentEleId) {
			//$(`#${contentEleId}`).attr("style", "");
			var ele = $(`#${contentEleId}`).remove();
			popup.append(ele);
			ele.attr("style", "");
			//popup.dialog("open");
		}
		if(title) {
			popup.dialog("option", "title", title);
		}
		if(contentLoadFunc) {
			contentLoadFunc.apply(null, args).then(() => {
				popup.dialog("open");
			}).catch(err => {
				console.log(err);
			});
		} else {
			popup.dialog("open");
		}
	}
}

function searchTransactions(event, transactionViewUrl, parentContainerId, startInputId, numInputId) {
	if(event.keyCode === 13) {
		var startBlock =  $(`#${startInputId}`).val();
		var numBlocks =  $(`#${numInputId}`).val();
		var parentEle = (parentContainerId instanceof Object) ? parentContainerId : $(`#${parentContainerId}`);
		ajaxUpdate(`${transactionViewUrl}&limit=10&offset=0&startBlock=${startBlock}&numBlocks=${numBlocks}`, parentEle);
	}
}

function loadLazyContainers() {
	var lazyElements = $(".lazyload");
	for(var i=0; i < lazyElements.length; i++) {
		var ele = $(lazyElements[i]);
		var loadUrl = ele.attr('loadurl');
		var clickId = ele.attr('clicktriggerid');
		if(clickId) {
			$(`#${clickId}`).click();
		} else {
			var loadEleId = ele.attr('loadeleid');
			var paranetEle = loadEleId ? $(`#${loadEleId}`) : ele.parent();
			if(loadEleId) {
				ele.remove();
			}
			ajaxUpdate(loadUrl, paranetEle);
		}
	}
}

function routineUpdate(uri, elementId, interval) {
	setInterval( function() {
		var uriPad = checkAndPadLocale(uri);
		$.ajax({url: uriPad, success: function(result) {
				updateElementValue(elementId, result, false);
			}
		});
	},interval);
}

function updateSupply() {
	routineUpdate("/api/supply","supply", 600000);
}

function updateMarketCap() {
	routineUpdate("/api/marketcap","totalmarketcap", 610000);
}

function updateLockByMN() {
	routineUpdate("/api/gettotallockedcoins","mntotallocked", 1810000);
}

function updateMasternodeCount() {
	routineUpdate("/api/getmasternodecount","mncount", 1800000);
}

function updateMasternodeReachableCount() {
	routineUpdate("/api/getmasternodereachablecount","mnreachable", 1800000);
}


function updateStats() {
	setInterval( function() {
		var checkEle = $("#hashrate");
		var uri = checkAndPadLocale("/ext/summary");
		if(checkEle && checkEle.length > 0) {
			$.ajax({url: uri, success: function(json){
				updateElementValue("hashrate", json.hashrate.rate + " ");
				updateElementAttr("hashUnit", "data-original-title", json.hashrate.unit);
				updateElementValue("txStats", json.txcount);
				updateElementValue("mempoolCount", json.mempool.count + " tx");
				updateElementValue("mempoolSize", json.mempool.size);
				updateElementValue("chainworkNum", json.chainwork.num);
				updateElementValue("chainworkExp", json.chainwork.exp);
				for(var diffName in json.diff) {
					updateElementValue(diffName, json.diff[diffName]);
				}
				updateElementValue("chainSize", json.chainSize);
				updateElementValue("price", json.price);
				updateElementValue("current-height", json.height);
			}});
		}
	}, 180000);
}

function getUrlVars(url) {
	if(!url) {
		url = window.location.href;
	}
    var vars = {};
    var parts = url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

var currentUrlParams = getUrlVars();
