package com.company.devicemanagement.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Hệ Thống Quản Lý Thiết Bị Nội Bộ - REST API")
                        .version("1.0.0")
                        .description("Tài liệu đặc tả API chuẩn OpenAPI 3.0 phục vụ quản lý thiết bị, phiếu mượn, duyệt/trả thiết bị và thống kê báo cáo.")
                        .contact(new Contact()
                                .name("Trương Đàm Công Quý")
                                .email("quytruong1404@gmail.com"))
                        .license(new License().name("Apache 2.0").url("https://springdoc.org")));
    }
}
