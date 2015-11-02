$('.js-delete').click(function() {
    if (!confirm('Are you sure you want to delete this?')) {
        return false;
    }
});

$('form').submit(function() {
    $('.js-selected option').prop('selected', true);
});

$('.move-right').click(function() {
    var option = $(this).parents('table').find('.js-unselected option:selected');
    $(this).parents('table').find('.js-selected').append(option);
});

$('.move-left').click(function() {
    var option = $(this).parents('table').find('.js-selected option:selected');
    $(this).parents('table').find('.js-unselected').append(option);
});