const teamLeadCredentialsTemplate = ({ teamLeadName, teamName, email, password, portalUrl }) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f4f6f8; margin: 0; padding: 20px; }
      .container { max-width: 600px; background: #ffffff; margin: 0 auto; border-radius: 4px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.08); border: 1px solid #e2dfd7; }
      .header { background: #19323f; color: #ffffff; padding: 24px; text-align: center; }
      .content { padding: 30px; color: #141719; line-height: 1.6; }
      .card { background: #f8f7f4; border: 1px solid #e2dfd7; border-radius: 4px; padding: 16px; margin: 20px 0; }
      .cred-row { display: flex; justify-content: space-between; margin-bottom: 8px; }
      .label { font-weight: bold; color: #697077; }
      .value { font-family: monospace; font-size: 15px; color: #141719; font-weight: bold; }
      .btn { display: inline-block; background: #c85a32; color: #ffffff !important; padding: 12px 24px; text-decoration: none; border-radius: 2px; font-weight: bold; margin-top: 15px; text-transform: uppercase; font-size: 13px; letter-spacing: 0.05em; }
      .footer { background: #f1efea; padding: 16px; text-align: center; font-size: 11px; color: #697077; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1 style="margin:0; font-size:20px; text-transform:uppercase; letter-spacing:0.08em;">College Project Hub</h1>
        <p style="margin:5px 0 0; opacity:0.85; font-size:12px; font-family:monospace;">Team Lead Assignment</p>
      </div>
      <div class="content">
        <p>Hello <strong>${teamLeadName}</strong>,</p>
        <p>You have been assigned as the <strong>Team Lead</strong> for team <strong>${teamName}</strong> by your instructor.</p>
        <p>Use the credentials below to log into the Project Hub and upload your team's project submission:</p>
        
        <div class="card">
          <div class="cred-row">
            <span class="label">Team Name:</span>
            <span class="value">${teamName}</span>
          </div>
          <div class="cred-row">
            <span class="label">Login Email:</span>
            <span class="value">${email}</span>
          </div>
          <div class="cred-row">
            <span class="label">One-Time Password:</span>
            <span class="value" style="color: #c85a32;">${password}</span>
          </div>
        </div>

        <p style="font-size: 13px; color: #697077;"><strong>Important Protocol:</strong> You are granted a <em>single one-time submission</em>. Ensure all project assets and documentation are finalized before submitting.</p>
        
        <center>
          <a href="${portalUrl || 'http://localhost:5173/upload'}" class="btn">Proceed to Submission Portal</a>
        </center>
      </div>
      <div class="footer">
        Automated Notification • College Project Hub Academic Commons
      </div>
    </div>
  </body>
  </html>
  `;
};

const studentTeamRegistrationTemplate = ({ teamLeadName, teamName, yearName, sectionName, email, members, portalUrl }) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f4f6f8; margin: 0; padding: 20px; }
      .container { max-width: 600px; background: #ffffff; margin: 0 auto; border-radius: 4px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.08); border: 1px solid #e2dfd7; }
      .header { background: #19323f; color: #ffffff; padding: 24px; text-align: center; }
      .content { padding: 30px; color: #141719; line-height: 1.6; }
      .card { background: #f8f7f4; border: 1px solid #e2dfd7; border-radius: 4px; padding: 16px; margin: 20px 0; }
      .cred-row { display: flex; justify-content: space-between; margin-bottom: 8px; }
      .label { font-weight: bold; color: #697077; }
      .value { font-family: monospace; font-size: 15px; color: #141719; font-weight: bold; }
      .btn { display: inline-block; background: #c85a32; color: #ffffff !important; padding: 12px 24px; text-decoration: none; border-radius: 2px; font-weight: bold; margin-top: 15px; text-transform: uppercase; font-size: 13px; letter-spacing: 0.05em; }
      .members-list { margin: 10px 0 0; padding-left: 20px; font-size: 13px; color: #484f56; }
      .footer { background: #f1efea; padding: 16px; text-align: center; font-size: 11px; color: #697077; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1 style="margin:0; font-size:20px; text-transform:uppercase; letter-spacing:0.08em;">College Project Hub</h1>
        <p style="margin:5px 0 0; opacity:0.85; font-size:12px; font-family:monospace;">Team Self-Registration Confirmed</p>
      </div>
      <div class="content">
        <p>Hello <strong>${teamLeadName}</strong>,</p>
        <p>Your team <strong>${teamName}</strong> has been successfully registered in the College Project Hub!</p>
        
        <div class="card">
          <div class="cred-row">
            <span class="label">Team Name:</span>
            <span class="value">${teamName}</span>
          </div>
          <div class="cred-row">
            <span class="label">Academic Cohort:</span>
            <span class="value">${yearName}</span>
          </div>
          <div class="cred-row">
            <span class="label">Section / Branch:</span>
            <span class="value">${sectionName}</span>
          </div>
          <div class="cred-row">
            <span class="label">Registered Email:</span>
            <span class="value">${email}</span>
          </div>

          ${
            members && members.length > 0
              ? `
            <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #e2dfd7;">
              <span class="label">Co-Researchers:</span>
              <ul class="members-list">
                ${members.map((m) => `<li>${m.name} ${m.rollNumber ? `(${m.rollNumber})` : ''}</li>`).join('')}
              </ul>
            </div>
            `
              : ''
          }
        </div>

        <p style="font-size: 13px; color: #697077;">You can now log in at any time with your chosen password to submit your project deliverables. Remember that submissions are strictly <em>one-time only</em>.</p>
        
        <center>
          <a href="${portalUrl || 'http://localhost:5173/upload'}" class="btn">Go to Submission Portal</a>
        </center>
      </div>
      <div class="footer">
        College Project Hub • Automated Registration Receipt
      </div>
    </div>
  </body>
  </html>
  `;
};

const evaluationResultTemplate = ({ teamLeadName, teamName, projectTitle, evaluation }) => {
  const { technicalApproach, idea, designThinking, uiUx, totalScore, feedback } = evaluation;

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f4f6f8; margin: 0; padding: 20px; }
      .container { max-width: 600px; background: #ffffff; margin: 0 auto; border-radius: 4px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.08); border: 1px solid #e2dfd7; }
      .header { background: #19323f; color: #ffffff; padding: 24px; text-align: center; }
      .content { padding: 30px; color: #141719; line-height: 1.6; }
      .score-table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 13px; }
      .score-table th, .score-table td { padding: 12px; border-bottom: 1px solid #e2dfd7; text-align: left; }
      .score-table th { background: #f8f7f4; color: #697077; font-family: monospace; text-transform: uppercase; font-size: 11px; }
      .total-row { font-weight: bold; background: #f8f7f4; color: #c85a32; font-size: 15px; }
      .feedback-box { background: #f8f7f4; border-left: 3px solid #c85a32; padding: 14px; margin-top: 15px; font-size: 13px; }
      .footer { background: #f1efea; padding: 16px; text-align: center; font-size: 11px; color: #697077; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1 style="margin:0; font-size:20px; text-transform:uppercase; letter-spacing:0.08em;">Evaluation Complete</h1>
        <p style="margin:5px 0 0; opacity:0.85; font-size:12px; font-family:monospace;">Faculty Assessment Scorecard</p>
      </div>
      <div class="content">
        <p>Dear <strong>${teamLeadName}</strong>,</p>
        <p>Your team <strong>${teamName}</strong>'s project submission <em>"${projectTitle}"</em> has been officially evaluated by the academic faculty. Here is your scorecard breakdown:</p>
        
        <table class="score-table">
          <thead>
            <tr>
              <th>Evaluation Rubric</th>
              <th style="text-align: right;">Score (out of 10)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Technical Approach & Architecture</td>
              <td style="text-align: right; font-weight:bold; font-family: monospace;">${technicalApproach} / 10</td>
            </tr>
            <tr>
              <td>Idea & Innovation</td>
              <td style="text-align: right; font-weight:bold; font-family: monospace;">${idea} / 10</td>
            </tr>
            <tr>
              <td>Design Thinking</td>
              <td style="text-align: right; font-weight:bold; font-family: monospace;">${designThinking} / 10</td>
            </tr>
            <tr>
              <td>UI & UX</td>
              <td style="text-align: right; font-weight:bold; font-family: monospace;">${uiUx} / 10</td>
            </tr>
            <tr class="total-row">
              <td>Total Aggregate Score</td>
              <td style="text-align: right; font-family: monospace;">${totalScore} / 40</td>
            </tr>
          </tbody>
        </table>

        ${
          feedback
            ? `
          <div class="feedback-box">
            <strong style="text-transform:uppercase; font-size:11px; color:#c85a32; display:block; margin-bottom:4px;">Faculty Feedback:</strong>
            <p style="margin: 0; color: #141719; font-style: italic;">"${feedback}"</p>
          </div>
        `
            : ''
        }

        <p style="margin-top: 25px; font-size: 13px; color: #697077;">Thank you for your participation and dedication to capstone engineering excellence.</p>
      </div>
      <div class="footer">
        College Project Hub • Evaluated by Academic Faculty
      </div>
    </div>
  </body>
  </html>
  `;
};

module.exports = {
  teamLeadCredentialsTemplate,
  studentTeamRegistrationTemplate,
  evaluationResultTemplate,
};
