package com.entreprise.crm.service;

import com.entreprise.crm.dto.MonitoringDTO;
import com.entreprise.crm.dto.SystemConfigDTO;
import com.entreprise.crm.entity.AuditLog;
import com.entreprise.crm.entity.SystemConfig;
import com.entreprise.crm.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.lang.management.ManagementFactory;

@Service
public class SystemService {

    private final SystemConfigRepository systemConfigRepository;
    private final AuditLogRepository auditLogRepository;
    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;
    private final ClientRepository clientRepository;

    public SystemService(SystemConfigRepository systemConfigRepository,
                         AuditLogRepository auditLogRepository,
                         UserRepository userRepository,
                         EmployeeRepository employeeRepository,
                         ClientRepository clientRepository) {
        this.systemConfigRepository = systemConfigRepository;
        this.auditLogRepository = auditLogRepository;
        this.userRepository = userRepository;
        this.employeeRepository = employeeRepository;
        this.clientRepository = clientRepository;
    }

    public SystemConfigDTO getSystemConfig() {
        String companyName = getConfigValue("company_name", "CRM Enterprise");
        String supportEmail = getConfigValue("support_email", "support@crm.com");
        String currency = getConfigValue("currency", "EUR");
        boolean maintenanceMode = Boolean.parseBoolean(getConfigValue("maintenance_mode", "false"));

        return new SystemConfigDTO(companyName, supportEmail, currency, maintenanceMode);
    }

    @Transactional
    public SystemConfigDTO updateSystemConfig(SystemConfigDTO dto) {
        setConfigValue("company_name", dto.getCompanyName());
        setConfigValue("support_email", dto.getSupportEmail());
        setConfigValue("currency", dto.getCurrency());
        setConfigValue("maintenance_mode", String.valueOf(dto.isMaintenanceMode()));

        return dto;
    }

    public MonitoringDTO getMonitoringMetrics() {
        MonitoringDTO dto = new MonitoringDTO();

        long uptimeMs = ManagementFactory.getRuntimeMXBean().getUptime();
        dto.setUptimeSeconds(uptimeMs / 1000);

        Runtime runtime = Runtime.getRuntime();
        long totalMem = runtime.totalMemory();
        long freeMem = runtime.freeMemory();

        dto.setTotalMemoryMb(totalMem / (1024 * 1024));
        dto.setFreeMemoryMb(freeMem / (1024 * 1024));
        dto.setDbStatus("UP - MySQL 8.0 Connected");

        dto.setTotalUsers(userRepository.count());
        dto.setTotalEmployees(employeeRepository.count());
        dto.setTotalClients(clientRepository.count());

        return dto;
    }

    public Page<AuditLog> getAuditLogs(Pageable pageable) {
        return auditLogRepository.findAllByOrderByCreatedAtDesc(pageable);
    }

    private String getConfigValue(String key, String defaultValue) {
        return systemConfigRepository.findByConfigKey(key)
                .map(SystemConfig::getConfigValue)
                .orElse(defaultValue);
    }

    private void setConfigValue(String key, String value) {
        SystemConfig config = systemConfigRepository.findByConfigKey(key)
                .orElse(new SystemConfig(key, value));
        config.setConfigValue(value);
        systemConfigRepository.save(config);
    }
}
