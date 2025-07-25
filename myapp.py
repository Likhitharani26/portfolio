from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
import os
import smtplib
from email.message import EmailMessage

# === Load .env Variables ===
load_dotenv()

app = Flask(__name__)

# === Routes ===
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/projects')
def projects():
    return render_template('projects.html')

@app.route('/certifications')
def certifications():
    return render_template('certifications.html')

@app.route('/technologies')
def technologies():
    return render_template('technologies.html')

@app.route('/internships')
def internships():
    return render_template('internships.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')

@app.route('/chat')
def chat():
    return render_template('chat.html')

# === Resume Request Form Handler ===
@app.route('/request_resume', methods=["POST"])
def request_resume():
    name = request.form.get("name")
    email = request.form.get("email")

    if not name or not email:
        return "<h3>❌ Please fill in all fields.</h3>"

    sender_email = os.getenv("SENDER_EMAIL")
    sender_password = os.getenv("SENDER_PASSWORD")
    recipient_email = sender_email  # You (Likhitharani) receive it

    approve_link = f"http://localhost:5000/approve_resume?email={email}&name={name}"
    deny_link = f"mailto:{email}?subject=Regarding%20Resume%20Request&body=Hi%20{name},%20thank%20you%20for%20your%20interest.%20Currently%20I’m%20unable%20to%20share%20my%20resume.%20Regards,%20Likhitharani"

    # Compose the HTML message
    html_content = f"""
    <html>
      <body style="font-family: Arial; background-color: #f4f4f4; padding: 20px;">
        <h2>📄 New Resume Access Request</h2>
        <p><strong>👤 Name:</strong> {name}</p>
        <p><strong>📧 Email:</strong> {email}</p>
        <p>👉 Choose how you want to respond:</p>
        <a href="{approve_link}" style="background-color:#0ef;color:#000;padding:12px 22px;text-decoration:none;border-radius:6px;font-weight:bold;margin-right:10px;">✅ Approve & Send Resume</a>
        <a href="{deny_link}" style="background-color:#ff4d4d;color:#fff;padding:12px 22px;text-decoration:none;border-radius:6px;font-weight:bold;">❌ Deny Request</a>
        <br><br>
        <p style="font-size: 0.85rem; color: #777;">This message was generated automatically from your portfolio website.</p>
      </body>
    </html>
    """

    msg = EmailMessage()
    msg['Subject'] = "📥 Resume Access Request via Portfolio"
    msg['From'] = sender_email
    msg['To'] = recipient_email
    msg.set_content(f"New resume request from {name} ({email}).")
    msg.add_alternative(html_content, subtype="html")

    try:
        server = smtplib.SMTP_SSL("smtp.gmail.com", 465)
        server.login(sender_email, sender_password)
        server.send_message(msg)
        server.quit()
        return "<h3>✅ Request received! Likhitharani will respond shortly.</h3>"
    except Exception as e:
        return f"<h3>❌ Error sending notification email: {str(e)}</h3>"


# === Resume Approval Route ===
@app.route('/approve_resume')
def approve_resume():
    hr_email = request.args.get("email")
    name = request.args.get("name")

    sender_email = os.getenv("SENDER_EMAIL")
    sender_password = os.getenv("SENDER_PASSWORD")

    resume_path = "static/resume/likhitharani_resume.pdf"

    cold_email = f"""
Dear {name},

Thank you for showing interest in connecting with me!

I’m glad to share my resume with you. I hold a strong foundation in Java Full Stack,FSD and Sql and have applied my skills to several projects.

Attached is my resume for your review. I look forward to hearing about any opportunities where I can contribute and grow.

Please feel free to get in touch with me!

Warm regards,  
Pachipala Likhitharani
Java & Fullstack Developer  
📧 likhitharani62@gmail.com  
🔗 LinkedIn: https://www.linkedin.com/in/likhitharani  
💻 GitHub: https://github.com/likhitharani
    """

    msg = EmailMessage()
    msg['Subject'] = "📎 Resume from Likhitharani"
    msg['From'] = sender_email
    msg['To'] = hr_email
    msg.set_content(cold_email)

    try:
        # Check if resume file exists
        if not os.path.exists(resume_path):
            return f"<h3>❌ Resume file not found at {resume_path}. Please upload your resume PDF to /static/resume/ folder and name it 'likhitharani_resume.pdf'</h3>"
        
        with open(resume_path, "rb") as f:
            msg.add_attachment(
                f.read(),
                maintype="application",
                subtype="pdf",
                filename="Likhitharani_Resume.pdf"
            )
    except FileNotFoundError:
        return "<h3>❌ Resume file not found. Please upload it to /static/resume/</h3>"
    except Exception as e:
        return f"<h3>❌ Error reading resume file: {str(e)}</h3>"

    try:
        server = smtplib.SMTP_SSL("smtp.gmail.com", 465)
        server.login(sender_email, sender_password)
        server.send_message(msg)
        server.quit()
        return f"<h3>✅ Resume sent successfully to {hr_email}!</h3>"
    except Exception as e:
        return f"<h3>❌ Failed to send resume: {str(e)}</h3>"


# === Start Server ===
if __name__ == "__main__":
    app.run(debug=True)
