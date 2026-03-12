<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:FFFB02,100:FFE015&height=320&section=header&text=𝐓𝐑𝐀𝐂𝐄-𝐀𝐁𝐈𝐋𝐈𝐓𝐘&fontSize=85&fontColor=FFFFFF&animation=fadeIn&desc=The%20Cognitive%20Black%20Box%20Recorder%20%7C%20Powered%20by%20AWS%20Nova%20Lite&descSize=22&descAlignY=65"/>
</p>

<br>

<p align="center">
  <img src="https://img.shields.io/badge/INTENT_ACCURACY-96.8%25-FFD700?style=for-the-badge&logo=target&logoColor=FFD700&labelColor=111111"/>
  &nbsp;&nbsp; 
  <img src="https://img.shields.io/badge/⚜️ COGNITIVE_ENGINE-AMAZON_NOVA_LITE-FFD700?style=for-the-badge&logo=Amazon%20AWS&logoColor=FF9900&labelColor=111111"/>
  &nbsp;&nbsp;
  <img src="https://img.shields.io/badge/ 🌟 INFRA-AWS_LAMBDA-FFD700?style=for-the-badge&logo=AWS%20Lambda&logoColor=FFD700&labelColor=111111"/>
  &nbsp;&nbsp;
  <img src="https://img.shields.io/badge/📀 STORAGE-DYNAMODB-FFD700?style=for-the-badge&logo=Amazon%20DynamoDB&logoColor=FFD700&labelColor=111111"/>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/PIPELINE-GIT_HOOKS_AUTOMATED-FFD700?style=for-the-badge&logo=git&logoColor=FFD700&labelColor=111111"/>
  &nbsp;&nbsp;
  <img src="https://img.shields.io/badge/🪞 REASONING-AGENTIC_LOGGING-FFD700?style=for-the-badge&logo=OpenAI&logoColor=FFD700&labelColor=111111"/>
</p>

---

## 🌐 LIVE NEURAL INTERFACE :

<p align="center">
  <a href="https://trace-ability-io6r.vercel.app/">
  <img src="https://img.shields.io/badge/LIVE_DASHBOARD-https%3A%2F%2Ftrace--ability.vercel.app-FFE015?style=for-the-badge&logo=vercel&logoColor=white&labelColor=111111" height="55"/>
</a>
</p>
<br><br>

> [!IMPORTANT]
**Hackathon submission note:** The first ~38 seconds of the demo video appear blank due to a recording/export issue. The actual demo begins at **00:38**.
> ## 🎥 SYSTEM TELEMETRY NOTE (DEMO VIDEO)
> Technical reasoning, live logs, and the dashboard deep-dive begin at **00:38**
> <p align="center"> <h3><p align="center"><a href="https://1drv.ms/v/c/db6afeda21cc0776/IQAnY3Pj4IQQT55LGvJqNt1rAY4aX1DEy1XHru6L4NF-3iM?e=Tet8ZZ"><b><font color="#FFD700">▶ WATCH THE SYSTEM DEMO HERE</font></b></a></p></h3> 

<br>

# <img src="assets/deep_learning.svg" height="50" width="50" align="top"> TRACE-ABILITY SYSTEMS :
**Trace-Ability acts as a Cognitive Black Box Recorder for software architecture**. Instead of only storing code diffs, it captures the **reasoning** and **architectural intent** behind each developer commit.
The system analyzes modified files, reconstructs the likely purpose of the change, and stores these insights as structured telemetry - creating a traceable record of how the system evolves.
<br>

---


## <img src="assets/idea.svg" height="40" width="40" align="top"> THE "CONTEXT COLLAPSE" ANOMALY :

| The Flaw | The Catalyst | The Reality |
| :--- | :--- | :--- |
| **Git tracks *what* changed, but erases the *why*.** | **AI accelerates code generation without capturing intent.** | **Endless hours wasted reverse-engineering massive technical debt.** |

Six months later, developers cannot explain why a critical service dependency was introduced . **Trace-Ability** bridges this gap by generating living, evolving documentation natively through semantic analysis, avoiding reliance on misleading or incomplete human commit messages .
<br>

---

## <img src="assets/brain.svg" height="35" width="35" align="top"> <span style="color: blue;">TRACE-ABILITY CORE CAPABILITIES :</span>

Trace-Ability uses Amazon Nova Lite to analyze raw code diffs and reconstruct the architectural intent behind each commit . 

* **Automated Intent Reconstruction:** Performs semantic analysis on code diffs to generate living documentation of architectural decisions.
* **Immutable Telemetry Ledger:** Stores project intelligence in a cryptographically verifiable log backed by Amazon DynamoDB.
* **Cognitive Value Add:** Generates trust scores and risk signals, turning complex diffs into concise summaries to reduce code-review effort.


---


## <img src="assets/ai.svg" height="35" width="35" align="top"> THE DETERMINISTIC TRUST MODEL :

To reduce the “black-box” uncertainty common in AI tooling, Trace-Ability assigns a deterministic trust score to each generated output using three core signals.
 <br>
 
 $$Trust = Model\ Confidence  \times Diff\ Consistency \times Change\ Locality$$

<br>

* **Model Confidence:** The LLM confidence score for the generated architectural explanation.
* **Diff Consistency:** Measures how well the commit message aligns with the actual code changes.
* **Change Locality:** Checks whether modifications stay within a logical module or are scattered across the codebase.

---

## <img src="assets/deep_learning_pipeline.svg" height="35" width="35" align="top"> SYSTEM ARCHITECTURE :

Trace-Ability operates on an event-driven CI pipeline built on GitHub Actions and powered by AWS Serverless technologies .

<p align="center">
  <img src="architecture.png" alt="Trace-Ability System Architecture" width="850">
  <br>
  <i><font color="#FFCC00" size="3">Figure 1.0: End-to-End Serverless Intelligence Layer</font></i>
</p>
<br>

### ⚙️ Architecture Components -

* **GitHub Repository:** Entry point where commit and push events trigger the webhook.
* **AWS Lambda (Webhook Receiver & Processor):** Processes GitHub events and extracts raw diffs and metadata.
* **Amazon Bedrock (Nova Lite):** Performs semantic analysis to generate the architectural narrative.
* **Amazon DynamoDB (Telemetry Ledger):** Stores commit intelligence and analysis results as an immutable record.
* **Next.js Dashboard:** Frontend deployed on Vercel that retrieves data via Lambda Function URLs to display trust scores and real-time updates.


---

## <img src="assets/api.svg" height="35" width="35" align="top"> HIGH-LEVEL PROCESS FLOW :

<p align="center">
  <img src="flowdiagram.png" alt="High-Level Process Flow" width="850">
  <br>
  <i><font color="#FFCC00" size="3">Figure 1.1: Multi-Stage Telemetry Ingestion and Agentic Reasoning Flow</font></i>
</p>
<br>

### 🛠️ The 5-Stage Pipeline -

1. **Developer Action:** A developer commits and pushes code to the repository.
2. **Event Capture:** Raw diff and commit metadata are intercepted and extracted.
3. **AI Analysis:** The system determines intent and calculates risk and trust scores.
4. **Ledger Storage:** The structured architectural narrative and scores are stored securely.
5. **Dashboard Visualization:** Results are streamed to the dashboard for real-time review.

   
---

## <img src="assets/cost-effectiveness.svg" height="35" width="35" align="top">  EVALUATION / RESULTS :

The intent-extraction pipeline runs on a fully serverless architecture, enabling efficient scale-to-zero operation.

* **Ultra-Low Deployment Cost:** The entire system - development, testing, and deployment - ran on approximately **$0.10 total cloud cost**, demonstrating the efficiency of a serverless AI architecture.
* **Cost Optimization:** The intelligence engine runs on **Amazon Nova Lite**, keeping the estimated MVP operating cost below **$10/month**.
* **Semantic Accuracy:** Evaluated on a ground-truth dataset of 50 complex commits, achieving an **81.4% semantic match rate** between the generated narrative and human intent.
* **Inference Latency:** Average intent-extraction time **< 3.5 seconds**, enabling CI/CD integration without blocking workflows.
* **Scale & Complexity:** Processed average diffs of **8–25 files per commit**, with the largest test handling **42 files**.
---

## <img src="assets/awsCloudLogo.svg" height="35" width="35" align="top"> TECHNOLOGIES UTILIZED :

| Category | Stack |
| :--- | :--- |
| **Cloud Compute & API** | AWS Lambda, Lambda Function URLs |
| **Generative AI** | Amazon Bedrock (Amazon Nova Lite) |
| **Database** | Amazon DynamoDB (with secured IAM least-privilege Scan/Query policies) |
| **Frontend Framework** | Next.js 15 (App Router), React, Tailwind CSS |
| **Animations & UI** | Framer Motion (Shared Layout Transitions, 3D Horizon Scrolling), Lucide Icons |
| **DevOps & Deployment** | Vercel (Custom Root Directory configs), GitHub Actions |

---

## 📸 SYSTEM TELEMETRY (DASHBOARD) :
<br>

<p align="center">
  <img src="assets/screenshots/screenshot_1.png" width="850" title="Operational Command Center: Real-time Cognitive Engineering HUD"><br>
 <br> <i> FIGURE 1:Operational Command Center: Real-time Cognitive Engineering HUD  </i>
<br>
  <br>
  <p align="center">
  <img src="assets/screenshots/screenshot_6.png" width="850" title="Neural Narrative: Semantic Intent Reconstruction & Confidence Scoring">
  &nbsp;&nbsp;&nbsp;&nbsp;
    <br> <i> FIGURE 2: Neural Narrative: Semantic Intent Reconstruction & Confidence Scoring </i>   
    <br><br>
</p>
</p>
<p align="center">
 <img src="assets/screenshots/screenshot_4.png" width="850" title="System Initialization: Bedrock-Enforced Telemetry Scanning"><br>
  <i> FIGURE 3: System Initialization: Bedrock-Enforced Telemetry Scanning </i>
  <br>
  <br>
  <img src="assets/screenshots/screenshot_5.png" width="850" title="Trace-Ability Core: Cognitive Black Box Recorder Branding"><br><br>
  <i> FIGURE 4: Trace-Ability Core: Cognitive Black Box Recorder Branding </i>
</p>

---

## 🧱 SYSTEM STRUCTURE :
 **Repository structure overview.**
```text
.
├── README.md
├── PRODUCT_SPECS.md
├── design.md
├── requirements.txt

│── architecture.png
│── flowdiagram.png

├── assets
│   ├── icons
│   │   ├── DynamoDB.svg
│   │   ├── Lambda.svg
│   │   ├── ai.svg
│   │   ├── api.svg
│   │   ├── brain.svg
│   │   └── ...
│   └── screenshots
│       ├── screenshot_1.png
│       ├── screenshot_2.png
│       ├── screenshot_3.png
│       ├── screenshot_4.png
│       ├── screenshot_5.png
│       └── screenshot_6.png

├── backend
│   └── lambda_handler.py

├── dashboard
│   ├── package.json
│   ├── next.config.ts
│   ├── tailwind.config.ts
│   └── src
│       ├── app
│       └── components

├── hooks
│   └── pre-commit.py

├── data
│   └── schema.json

└── tests
    ├── github_api_test.py
    └── sample_diff.json

```
---

## <img src="assets/creative.svg" height="35" width="35" align="top"> DEPLOYMENT & LOCAL SETUP :
Trace-Ability runs on AWS Lambda, so the pipeline executes only when a git push triggers it.
```
Bash
# 1. Clone the repository
git clone [https://github.com/sohamrajput98/Trace-Ability.git](https://github.com/sohamrajput98/Trace-Ability.git)
cd Trace-Ability

# 2. Configure Local Webhooks
chmod +x hooks/pre_commit.py
ln -sf ../../hooks/pre_commit.py .git/hooks/pre-commit

# 3. Environment Provisioning
pip install -r requirements.txt
# Ensure AWS CLI is configured with Bedrock (Nova Lite) permissions
# Deploy backend/lambda_handler.py to AWS Lambda

```
---

## <img src="assets/brain.svg" height="35" width="35" align="top"> FUTURE IMPROVEMENTS :
- **Multi-Signal Context Aggregation:** Expanding the pipeline to ingest <i>**Issue descriptions (Jira)** </i>, <i>**PR discussions**</i>, and <i>**Slack threads**</i> alongside the code diff to generate a complete 360-degree view of developer intent .

- **Pull Request Advisor:** Injecting the <i>**Bedrock architectural narrative**</i> directly into **GitHub PR comments** as an automated reviewer before code merge .

- **Semantic "Why" Search:** Allowing developers to <i>**query the DynamoDB intent-registry**</i> (e.g., "Why did we introduce Redis to the auth service in January?") .
<br> <br>



<p align="center"><hr style="border:0; height:1px; background:#333; width:100%"></p>

<div align="center">
  <h3 style="color: #FF4500; font-family: 'Courier New', Courier, monospace; letter-spacing: 2px;">
     <img src="assets/sparkle.svg" width="20" style="vertical-align: middle; margin-right: 15px;"> 𝐋𝐄𝐀𝐃 𝐄𝐍𝐆𝐈𝐍𝐄𝐄𝐑-  <span style="color: #FFFFFF;">𝕾𝖔𝖍𝖆𝖒 𝕽𝖆𝖏𝖕𝖚𝖙</span> 
  </h3> <p align="center">
 
</p>
  <img src="assets/Lambda.svg" width="80" style="vertical-align: middle; margin-right: 15px;">
  <img src="assets/DynamoDB.svg" width="80" style="vertical-align: middle; margin-right: 15px;">
<div align="center">
  <div style="display: flex; justify-content: center; align-items: center; gap: 100px;">     
    <div style="text-align: center;">
     <h3>  Architected with </h3>
      <img src="https://github.com/sohamrajput98/EduShield/blob/main/assets/love.svg" width="70" height="70" style="vertical-align: middle;">
    </div>
    <div style="text-align: center;">
      <p>
        <span style="display: inline-block; vertical-align: middle; text-align: left;">
           <img src="assets/amazon.svg" width="240">
          <img src="assets/webservices.svg" width="240">
        </span>
      </p>
    </div>

  </div>
</div>

  </div>
</div>
<p align="center">
<img src="https://capsule-render.vercel.app/api?type=waving&color=0:FFFB02,100:FFE015&height=180&section=footer&text=TRACE-ABILITY%20:%20COMMIT%20INTELLIGENCE%20ENGINE&fontColor=FFFFFF&fontSize=34&fontAlignY=65"/>
</p>
