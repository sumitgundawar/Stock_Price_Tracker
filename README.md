# Stock Price Tracker
This simple web application built with Flask and JavaScript allows users to track the current price and percentage change of stocks, index funds, ETFs, and cryptocurrencies using the Yahoo Finance API. The application updates the price every 10 seconds and displays the information in real time on the web page.

![SPT Screenshot](https://github.com/sumitgundawar/Stock_Price_Tracker/assets/65755826/dee09788-2a81-4e6e-8b79-49c8c0f7798b)

## Getting Started
Follow these instructions to set up and run the stock price tracker on your local machine.

## Prerequisites
Make sure you have Python and pip installed on your system.

## Installation
1. Clone the repository:
   <br>git clone https://github.com/sumitgundawar/Stock_Price_Tracker.git
   <br>cd Stock_Price_Tracker

2. Create a virtual environment (recommended):
   <br>On Windows
   <br>python -m venv venv
   <br><br>On macOS and Linux
   <br>python3 -m venv venv

3. Activate the virtual environment:
   <br>On Windows
   <br>venv\Scripts\activate
   <br><br>On macOS and Linux
   <br>source venv/bin/activate

4. Install the required packages using pip:
   <br>pip install -r requirements.txt

## Usage
1. Start the Flask application by running the following command:
   python app.py
2. Open your web browser and go to http://127.0.0.1:5000 to access the stock price tracker.
3. On the web page, you will find a search box and an "Add" button. Enter the name of a stock, index fund, ETF, or cryptocurrency and click the "Add" button.
4. A recommendation system also searches the symbols.csv file, update the file as per your requirement.
5. The application will fetch the entered asset's current price and calculate percentage change using the Yahoo Finance API and display the information on the web page.
6. The price will be automatically updated every 10 seconds showing red, green, or gray color as per the movement of the asset, providing real-time tracking.

## Technologies Used
Flask: Python web framework used for serving the application.
<br>JavaScript: Used to fetch and update real-time data from the Yahoo Finance API.
<br>Yahoo Finance API: Used to retrieve stock and financial data.

## Directory Structure
app.py: Initializes the Flask application and renders the HTML template.
<br>static/: Contains static assets such as CSS and JavaScript files, along with a CSV file for recommendation.
<br>templates/: Contains the HTML template for the web page.
<br>requirements.txt: Lists the required Python packages for the project.

## Contributing
Contributions are welcome! If you'd like to contribute to the project, please fork the repository and submit a pull request.
