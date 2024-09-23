from flask import Flask, request, render_template, jsonify
import psutil
import os
import pandas as pd


# Print available network interfaces
print(psutil.net_if_stats())

app = Flask(__name__, template_folder='.')

# Folder to store uploaded files
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'dataset' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['dataset']
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    # Save the uploaded file
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)

    # Read dataset info
    try:
        if file.filename.endswith('.xlsx'):
            df = pd.read_excel(file_path)
        elif file.filename.endswith('.html'):
            df = pd.read_html(file_path)[0]  # Assume the first table if multiple
        else:
            return jsonify({'error': 'Invalid file format'}), 400

        # Get dataset information
        info = {
            'file_name': file.filename,
            'rows': df.shape[0],
            'columns': df.shape[1],
            'size': os.path.getsize(file_path) // 1024,  # Size in KB
            'preview': df.head().to_json()  # Get the first few rows as JSON
        }
        return jsonify(info)

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
    
@app.route('/resources')
def resources():
    # Get current CPU usage
    cpu_usage = psutil.cpu_percent(interval=1)

    # Get current RAM usage
    ram_usage = psutil.virtual_memory().percent

    # Check network status dynamically
    network_status = "Unknown"
    for interface, stats in psutil.net_if_stats().items():
        if stats.isup:
            network_status = interface  # Use the first active interface found
            break

    return jsonify({
        'cpu_usage': cpu_usage,
        'ram_usage': ram_usage,
        'network': network_status
    })


# Other routes and logic for feature selection and output can be added here...

if __name__ == '__main__':
    app.run(debug=True)
