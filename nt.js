

let beginDate = false;
let endDate = false;
let page = 0;

$('#datepicker1').datepicker({
    format : 'yyyy-mm-dd',

}).on('changeDate',onStartDateChage);

function onStartDateChage() {
    beginDate = $(this).val().replace(/\-/g, '');

    getArticles(page, beginDate, endDate);
}


$('#datepicker2').datepicker({
    format : 'yyyy-mm-dd'
}).on('changeDate',onEndDateChage);

function onEndDateChage() {
    endDate = $(this).val().replace(/\-/g, '');

    getArticles(page, beginDate, endDate);

}

const container = $('#table');

getArticles(page);

function getArticles(page, beginDate, endDate) {



    let url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";



    let params = {
        'api-key': "259b32c714c04ec2a4da94cf49a938ec",
        'page': page
    };

    if(beginDate){
        params['begin_date'] = beginDate;
    }
    if(endDate){
        params['end_date'] = endDate;
    }

    url += '?' + $.param(params);
    $.ajax({
        url: url,
        method: 'GET',
    }).done(function (result) {

        let tpl = getHtml(result);
        let pager = getPager(page, result.response.meta.hits);

        container.empty();
        container.append(tpl+pager);
        $('.links').click(function () {

           page = parseInt($(this).data('i'))  ;
           getArticles(page, beginDate, endDate);
        });
    }).fail(function (err) {
        throw err;
    });

}

function getPager(page, hits) {

    let allPage = Math.floor(hits/10);
    if(allPage>=120){
        allPage = 120;
    }

    let start = page - 2;

    if (start < 0) {
        start = 0;
    }

    let finish = start + 4;

    if (finish > allPage) {
        let dif = finish - allPage;
        finish = allPage;
        start = start - dif;
    }

    let tpl = '<ul class="pagination">';
    if(page>2){
        tpl += '<li>';
        tpl += '<a href="#" data-i="0" class="links">&laquo;</a>';
        tpl += '</li>';
        tpl += '<li>';
        tpl += '<a href="#">...</a>';
        tpl += '</li>';
    }
    let a = start + 1;
    for (let i = start; i <= finish; i++) {
        if (i == page) {
            tpl += '<li class="active"><a data-i="'+i+'" class="links" href="#">'+a+'</a></li>';
        } else {
            tpl += '<li><a class="links" data-i="'+i+'" href="#">'+a+'</a></li>';
        }
        a++;
    }

    if(page<(allPage-2)){
        tpl += '<li>';
        tpl += '<a href="#">...</a>';
        tpl += '</li>';
        tpl += '<li>';
        tpl += '<a href="#" data-i="'+allPage+'" class="links">&raquo;</a>';
        tpl += '</li>';

    }

    tpl += '</ul>';

    return tpl;

}

function getHtml(result) {
    let tpl = '<table class="table table-hover">';
    tpl += '<tbody>';
    tpl += '<tr>';
    tpl += '<th>Title</th>';
    tpl += '<th>Lead</th>';
    tpl += '<th>Publicated date</th>';
    tpl += '</tr>';

    $.each(result.response.docs, function (key, value) {
        let current = new Date(value.pub_date);
        tpl += '<tr>';
        tpl += '<td>';
        tpl += value.headline.main;
        tpl += '</td>';
        tpl += '<td>';
        tpl += value.lead_paragraph;
        tpl += '</td>';
        tpl += '<td>';
        tpl += current.toDateString();
        tpl += '</td>';
        tpl += '</tr>';
    });

    tpl += '</tbody>';
    tpl += '</table>';

    return tpl;
}
