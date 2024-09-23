// Handle dataset upload and display dataset information
document.getElementById('upload-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const formData = new FormData();
    const dataset = document.getElementById('dataset').files[0];
    formData.append('dataset', dataset);

    fetch('/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        // Update dataset information in the UI
        document.getElementById('file-name').innerText = data.file_name;
        document.getElementById('rows').innerText = data.rows;
        document.getElementById('columns').innerText = data.columns;
        document.getElementById('size').innerText = (data.size / 1024).toFixed(2) + ' KB';
    })
    .catch(error => console.error('Error uploading file:', error));
});

// Function to update the resource info every 5 seconds
// Function to update the resource info every 5 seconds
function updateResourceInfo() {
    fetch('/resources')
        .then(response => response.json())
        .then(data => {
            document.getElementById('ram').innerText = data.ram_usage + ' %';
            document.getElementById('cpu').innerText = data.cpu_usage + ' %';
            document.getElementById('network').innerText = data.network;
        })
        .catch(error => console.error('Error fetching resource data:', error));
}

// Call the update function every 5 seconds to refresh resource info
setInterval(updateResourceInfo, 5000);

// Initial call to display the data when the page is loaded
updateResourceInfo();
// Call the update function every 5 seconds to refresh resource info
setInterval(updateResourceInfo, 5000);

// Initial call to display the data when the page is loaded
updateResourceInfo();

// Handle feature selection submission
document.getElementById('feature-selection-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const formData = new FormData(this);
    const selectedFeatures = formData.getAll('features');

    fetch('/select_features', {
        method: 'POST',
        body: new URLSearchParams(formData)
    })
    .then(response => response.text())
    .then(data => {
        document.getElementById('selected-features-output').innerText = data;
    })
    .catch(error => console.error('Error selecting features:', error));
});

// Function to update the output graph or results
function updateOutput() {
    fetch('/plot')
        .then(response => response.text())
        .then(data => {
            document.getElementById('output-section').innerHTML = data; // This should display your graph or output
        })
        .catch(error => console.error('Error fetching output data:', error));
}

// Trigger output update (this can be connected to a button if needed)
document.getElementById('output-btn').addEventListener('click', updateOutput);

// Handle log file download
document.getElementById('download-log-btn').addEventListener('click', function () {
    fetch('/download_log')
        .then(response => response.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'logfile.txt';
            document.body.appendChild(a);
            a.click();
            a.remove();
        })
        .catch(error => console.error('Error downloading log file:', error));
});


fetch('/upload', {
    method: 'POST',
    body: formData
})
.then(response => response.json())
.then(data => {
    if (data.error) {
        console.error('Error:', data.error);
    } else {
        document.getElementById('file-name').innerText = data.file_name;
        document.getElementById('rows').innerText = data.rows;
        document.getElementById('columns').innerText = data.columns;
        document.getElementById('size').innerText = data.size + ' KB';
        
        // Display dataset preview
        const preview = JSON.parse(data.preview);
        let previewHTML = '<h4>Dataset Preview:</h4><table class="table"><thead><tr>';
        Object.keys(preview[0]).forEach(key => {
            previewHTML += `<th>${key}</th>`;
        });
        previewHTML += '</tr></thead><tbody>';
        
        for (const row of Object.values(preview)) {
            previewHTML += '<tr>';
            Object.values(row).forEach(value => {
                previewHTML += `<td>${value}</td>`;
            });
            previewHTML += '</tr>';
        }
        previewHTML += '</tbody></table>';
        
        document.getElementById('dataset-info').innerHTML += previewHTML;
    }
})
.catch(error => console.error('Error uploading file:', error));
