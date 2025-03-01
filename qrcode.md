```mermaid
flowchart TD
    %% Define Colors
    classDef startStyle fill:#4CAF50,stroke:#333,stroke-width:2px,color:#fff;
    classDef decisionStyle fill:#FFC107,stroke:#333,stroke-width:2px,color:#000;
    classDef processStyle fill:#2196F3,stroke:#333,stroke-width:2px,color:#fff;
    classDef errorStyle fill:#F44336,stroke:#333,stroke-width:2px,color:#fff;

    %% Start Process
    start(Start) --> checkToken{Is Token Present and Valid?}
    class start startStyle

    %% Token Verification
    checkToken -->|No| errorResponse[Error: Invalid or Missing Token - Access Denied]
    checkToken -->|Yes| checkLogin{Is User Logged In?}
    class checkToken decisionStyle
    class errorResponse errorStyle

    %% Login Handling
    checkLogin -->|No| promptLogin[Prompt User to Log In or Sign Up]
    checkLogin -->|Yes| promptAgreement[Prompt User to Accept Service Agreement]
    class checkLogin decisionStyle
    class promptLogin processStyle
    class promptAgreement processStyle

    %% Service Agreement Handling
    promptLogin --> promptAgreement
    promptAgreement --> checkAgreement{Did User Accept the Service Agreement?}
    class checkAgreement decisionStyle

    checkAgreement -->|No| errorResponse
    checkAgreement -->|Yes| enterMainFlow[Enter Main Registration Flow]
    class enterMainFlow processStyle
```

## **Token Verification & Initial Steps**  

### **QR Code & Token Validation**  
Before starting the registration process, users must **scan a QR code** containing a **unique token**.  

- **If the token is missing or invalid:**  
  - The system returns an **error message** and **blocks access**.  
- **If the token is valid:**  
  - The system proceeds to check the **user's login status**.  

---

### **Login & Service Agreement Handling**  

#### **If the user is logged in:**  
- They are **prompted** to accept the **service agreement** before continuing.  

#### **If the user is NOT logged in:**  
- They are required to **log in or sign up** first.  
- After successfully logging in or creating an account, they are **prompted to accept the service agreement**.  
