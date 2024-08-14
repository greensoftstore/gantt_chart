var today = moment().startOf('day');

var Calendar = {
    Periods: [
        {
            Name: '1 week',
            Label: '1 week',
            TimeframePeriod: (60 * 24),
            TimeframeOverall: (60 * 24 * 7),
            TimeframeHeaders: [
                'MMM',
                'Do'
            ],
            Classes: 'period-1week'
        }
    ],

    Items: [
        {
            id: 20,
            name: '<div>Item 1</div><div>Sub Info</div>',
            sectionID: 1,
            start: moment(today).add('days', -1),
            end: moment(today).add('days', 2),
            classes: 'item-status-three'
        },
        {
            id: 21,
            name: '<div>Item 2</div><div>Sub Info</div>',
            sectionID: 2,
            start: moment(today).add('days', -1),
            end: moment(today).add('days', 1),
            classes: 'item-status-one'
        },
        {
            id: 22,
            name: '<div>Item 3</div><div>Sub Info</div>',
            start: moment(today).add('hours', 12),
            end: moment(today).add('days', 2).add('hours', 4),
            sectionID: 3,
            classes: 'item-status-none'
        }
    ],

    Sections: [
        {
            id: 1,
            name: 'Lathe'
        },
        {
            id: 2,
            name: 'Mill'
        },
        {
            id: 3,
            name: 'Saw'
        }
    ],

    Init: function () {
        TimeScheduler.Options.GetSections = Calendar.GetSections;
        TimeScheduler.Options.GetSchedule = Calendar.GetSchedule;
        TimeScheduler.Options.Start = today;
        TimeScheduler.Options.Periods = Calendar.Periods;
        TimeScheduler.Options.SelectedPeriod = '1 week';
        TimeScheduler.Options.Element = $('.calendar');

        TimeScheduler.Options.AllowDragging = true;
        TimeScheduler.Options.AllowResizing = true;

        TimeScheduler.Options.Events.ItemClicked = Calendar.Item_Clicked;
        TimeScheduler.Options.Events.ItemDropped = Calendar.Item_Dragged;
        TimeScheduler.Options.Events.ItemResized = Calendar.Item_Resized;

        TimeScheduler.Options.Text.NextButton = '&nbsp;';
        TimeScheduler.Options.Text.PrevButton = '&nbsp;';

        TimeScheduler.Options.MaxHeight = 100;

        TimeScheduler.Init();
    },

    GetSections: function (callback) {
        callback(Calendar.Sections);
    },

    GetSchedule: function (callback, start, end) {
        callback(Calendar.Items);
    },

    Item_Clicked: function (item) {
        console.log(item);
    },

    Item_Dragged: function (item, sectionID, start, end) {
        var foundItem;

        for (var i = 0; i < Calendar.Items.length; i++) {
            foundItem = Calendar.Items[i];

            if (foundItem.id === item.id) {
                foundItem.sectionID = sectionID;
                foundItem.start = start;
                foundItem.end = end;

                Calendar.Items[i] = foundItem;
            }
        }

        TimeScheduler.Init();
    },

    Item_Resized: function (item, start, end) {
        var foundItem;

        for (var i = 0; i < Calendar.Items.length; i++) {
            foundItem = Calendar.Items[i];

            if (foundItem.id === item.id) {
                foundItem.start = start;
                foundItem.end = end;

                Calendar.Items[i] = foundItem;
            }
        }

        TimeScheduler.Init();
    }
};

$(document).ready(Calendar.Init);