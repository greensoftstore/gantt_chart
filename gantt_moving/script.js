document.addEventListener('DOMContentLoaded', function() {
    let height = 60;
  
    const tasks = [
        { name: 'Lathe', width: '80', offset: '100' },
        { name: 'Mill', width: '120', offset: '80' },
        { name: 'Saw', width: '60', offset: '70' },
    ];

    const ganttChart = document.getElementById('ganttChart');

    const taskList = document.createElement('div');
    taskList.className = 'task-list';
    const ul = document.createElement('ul');
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'item-row';
        const span = document.createElement('span');
        span.textContent = `${task.name}`;
        li.appendChild(span);
        ul.appendChild(li);
    });
    taskList.appendChild(ul);
    ganttChart.appendChild(taskList);

    const chart = document.createElement('div');
    chart.className = 'chart';

    tasks.forEach((task, index) => {
        const chartRow = document.createElement('div');
        chartRow.className = 'item-row';
        const bar = document.createElement('div');
        bar.className = 'chart-bar';
        bar.dataset.index = index;
        bar.style.width = `${task.width}px`;
        bar.style.left = `${task.offset}px`;

        chartRow.appendChild(bar);
        chart.appendChild(chartRow);
    });
    ganttChart.appendChild(chart);

    interact('.chart-bar')
    .draggable({
        modifiers: [
            interact.modifiers.snap({
                targets: [
                  interact.snappers.grid({ x: 1, y: height })
                ],
                range: Infinity,
                relativePoints: [ { x: 0, y: 0 } ]
              }),
            interact.modifiers.restrict({
                restriction: '.chart',
                elementRect: { top: 0, left: 0, bottom: 1, right: 1 },
                endOnly: true
            })
        ],
        autoScroll: true,
        listeners: { move: dragMoveListener }
    })
    .resizable({
        // resize from all edges and corners
        edges: { left: true, right: true, bottom: false, top: false },
        listeners: {
          move (event) {
            var target = event.target
            var x = (parseFloat(target.getAttribute('data-x')) || 0)
            var y = (parseFloat(target.getAttribute('data-y')) || 0)
    
            // update the element's style
            target.style.width = event.rect.width + 'px'
            target.style.height = event.rect.height + 'px'
    
            // translate when resizing from top or left edges
            x += event.deltaRect.left
            y += event.deltaRect.top
    
            target.style.transform = 'translate(' + x + 'px,' + y + 'px)'
    
            target.setAttribute('data-x', x)
            target.setAttribute('data-y', y)
          }
        },
        modifiers: [
          // keep the edges inside the parent
          interact.modifiers.restrictEdges({
            outer: '.item-row'
          }),
    
          interact.modifiers.restrictSize({
            min: { width: 30 }
          })
        ]
    })

    function dragMoveListener (event) {
        var target = event.target
        // keep the dragged position in the data-x/data-y attributes
        var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
        var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy
        
        // translate the element
        target.style.transform = 'translate(' + x + 'px, ' + y + 'px)'
        
        // update the posiion attributes
        target.setAttribute('data-x', x)
        target.setAttribute('data-y', y)
    }

    interact('.item-row').dropzone({
        // only accept elements matching this CSS selector
        accept: '.chart-bar',
        // Require a 75% element overlap for a drop to be possible
        overlap: 0.75,
        
        // listen for drop related events:
        
        ondropactivate: function (event) {
            // add active dropzone feedback
            event.target.classList.add('drop-active')
        },
        ondragenter: function (event) {
            var draggableElement = event.relatedTarget
            var dropzoneElement = event.target
        
            // feedback the possibility of a drop
            dropzoneElement.classList.add('drop-target')
            draggableElement.classList.add('can-drop')
        },
        ondragleave: function (event) {
            // remove the drop feedback style
            event.target.classList.remove('drop-target')
            event.relatedTarget.classList.remove('can-drop')
        },
        ondrop: function (event) {
        },
        ondropdeactivate: function (event) {
            // remove active dropzone feedback
            event.target.classList.remove('drop-active')
            event.target.classList.remove('drop-target')
        }
    })
});