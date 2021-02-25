package com.boot.main.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.http.CacheControl;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

import java.util.concurrent.TimeUnit;

@Configuration
public class WebConfig extends WebMvcConfigurerAdapter {
    /**
     * <p>设置静态资源缓存时间:1年</p>
     * <p>注意:不可缓存入口文件</p>
     * @param registry 资源注册
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/static/**")
                .addResourceLocations("classpath:/static/")
                .setCacheControl(CacheControl.maxAge(365, TimeUnit.DAYS).cachePublic())
                .setCachePeriod(3153600);
    }
}
