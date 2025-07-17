#!/usr/bin/env python3
"""
Main application entry point.
This file imports and runs the Flask application.
"""

import os
from myapp import app

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)