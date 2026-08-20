package com.entreprise.crm.dto;

public class SystemConfigDTO {
    private String companyName;
    private String supportEmail;
    private String currency;
    private boolean maintenanceMode;

    public SystemConfigDTO() {
    }

    public SystemConfigDTO(String companyName, String supportEmail, String currency, boolean maintenanceMode) {
        this.companyName = companyName;
        this.supportEmail = supportEmail;
        this.currency = currency;
        this.maintenanceMode = maintenanceMode;
    }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public String getSupportEmail() { return supportEmail; }
    public void setSupportEmail(String supportEmail) { this.supportEmail = supportEmail; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public boolean isMaintenanceMode() { return maintenanceMode; }
    public void setMaintenanceMode(boolean maintenanceMode) { this.maintenanceMode = maintenanceMode; }
}
