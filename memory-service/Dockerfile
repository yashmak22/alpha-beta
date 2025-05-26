FROM python:3.10-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Set environment variables
ENV PORT=3003
ENV PYTHONUNBUFFERED=1

# Expose the port
EXPOSE 3003

# Run the application
CMD ["python", "src/main.py"]
