package com.entreprise.crm.controller;

import com.entreprise.crm.dto.MonitoringDTO;
import com.entreprise.crm.dto.SystemConfigDTO;
import com.entreprise.crm.entity.AuditLog;
import com.entreprise.crm.service.SystemService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/system")
@PreAuthorize("hasRole('SUPER_ADMIN')")
public class SystemServiceController {

    private final SystemService systemService;

    public SystemServiceController(SystemService systemService) {
        this.systemService = systemService;
    }

    @GetMapping("/config")
    public ResponseEntity<SystemConfigDTO> getSystemConfig() {
        return ResponseEntity.ok(systemService.getSystemConfig());
    }

    @PutMapping("/config")
    public ResponseEntity<SystemConfigDTO> updateSystemConfig(@RequestBody SystemConfigDTO dto) {
        return ResponseEntity.ok(systemService.updateSystemConfig(dto));
    }

    @GetMapping("/monitoring")
    public ResponseEntity<MonitoringDTO> getMonitoringMetrics() {
        return ResponseEntity.ok(systemService.getMonitoringMetrics());
    }

    @GetMapping("/logs")
    public ResponseEntity<Page<AuditLog>> getAuditLogs(Pageable pageable) {
        return ResponseEntity.ok(systemService.getAuditLogs(pageable));
    }
}
