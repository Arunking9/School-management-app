import config from '../config.js';

class OpenAIService {
    constructor() {
        this.apiKey = config.OPENAI_API_KEY;
        this.apiUrl = config.OPENAI_API_URL;
        this.securityLogs = [];
        this.serviceStatus = {};
        this.contentCache = new Map();
    }

    async generateAssistantResponse(prompt, systemRole = "You are a helpful educational assistant for a school management system.") {
        try {
            const response = await fetch(`${this.apiUrl}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: "gpt-4",
                    messages: [
                        {
                            role: "system",
                            content: systemRole
                        },
                        {
                            role: "user",
                            content: prompt
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 150
                })
            });

            if (!response.ok) {
                throw new Error(`OpenAI API Error: ${response.status}`);
            }

            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            console.error('OpenAI API Error:', error);
            this.logSecurityEvent('api_error', error.message);
            throw error;
        }
    }

    // File Handling Methods
    async analyzeFile(file) {
        try {
            const fileContent = await this.readFileContent(file);
            const prompt = `Analyze this file content for potential security issues and validate its format: ${fileContent}`;
            const systemRole = "You are a security expert analyzing files for potential threats and format validation.";
            return await this.generateAssistantResponse(prompt, systemRole);
        } catch (error) {
            this.logSecurityEvent('file_analysis_error', error.message);
            throw error;
        }
    }

    async readFileContent(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => {
                this.logSecurityEvent('file_read_error', e.target.error);
                reject(e.target.error);
            };
            reader.readAsText(file);
        });
    }

    // Security Monitoring Methods
    async monitorSecurity() {
        try {
            const systemRole = "You are a security monitoring system analyzing system events and user activities.";
            const prompt = `Analyze these security logs and identify potential threats: ${JSON.stringify(this.securityLogs)}`;
            return await this.generateAssistantResponse(prompt, systemRole);
        } catch (error) {
            console.error('Security monitoring error:', error);
            throw error;
        }
    }

    logSecurityEvent(type, details) {
        const event = {
            type,
            details,
            timestamp: new Date().toISOString(),
            userId: localStorage.getItem('userId') || 'unknown'
        };
        this.securityLogs.push(event);
        console.log('Security event logged:', event);
    }

    async detectAnomalies(userData) {
        try {
            const systemRole = "You are an anomaly detection system analyzing user behavior patterns.";
            const prompt = `Analyze this user activity data for potential anomalies: ${JSON.stringify(userData)}`;
            return await this.generateAssistantResponse(prompt, systemRole);
        } catch (error) {
            this.logSecurityEvent('anomaly_detection_error', error.message);
            throw error;
        }
    }

    // Service Management Methods
    async monitorService(serviceName) {
        try {
            const serviceData = this.serviceStatus[serviceName] || { uptime: 0, errors: [] };
            const systemRole = "You are a service monitoring system analyzing service health and performance.";
            const prompt = `Analyze this service data and provide recommendations: ${JSON.stringify(serviceData)}`;
            return await this.generateAssistantResponse(prompt, systemRole);
        } catch (error) {
            this.logSecurityEvent('service_monitoring_error', error.message);
            throw error;
        }
    }

    updateServiceStatus(serviceName, status) {
        this.serviceStatus[serviceName] = {
            ...this.serviceStatus[serviceName],
            lastUpdate: new Date().toISOString(),
            status
        };
    }

    // Content Analysis Methods
    async analyzeContent(content, type = 'text') {
        try {
            const systemRole = "You are a content analysis system checking for inappropriate or malicious content.";
            const prompt = `Analyze this ${type} content for appropriateness and safety: ${content}`;
            return await this.generateAssistantResponse(prompt, systemRole);
        } catch (error) {
            this.logSecurityEvent('content_analysis_error', error.message);
            throw error;
        }
    }

    // Enhanced Educational Features
    async generateChapterSummary(chapterContent) {
        try {
            const safeContent = await this.analyzeContent(chapterContent);
            const prompt = `Please provide a concise summary of this chapter content: ${safeContent}`;
            return await this.generateAssistantResponse(prompt);
        } catch (error) {
            console.error('Failed to generate chapter summary:', error);
            throw error;
        }
    }

    async generateStudyQuestions(chapterContent) {
        try {
            const safeContent = await this.analyzeContent(chapterContent);
            const prompt = `Generate 3 study questions based on this chapter content: ${safeContent}`;
            return await this.generateAssistantResponse(prompt);
        } catch (error) {
            console.error('Failed to generate study questions:', error);
            throw error;
        }
    }

    // Content Enrichment Methods
    async enrichContent(topic, subject, gradeLevel) {
        try {
            const cacheKey = `${subject}-${topic}-${gradeLevel}`;
            if (this.contentCache.has(cacheKey)) {
                return this.contentCache.get(cacheKey);
            }

            const systemRole = "You are an educational content curator finding relevant learning materials.";
            const prompt = `Find educational resources for ${subject}, topic: ${topic}, grade level: ${gradeLevel}. 
                          Include: 
                          1. YouTube video links
                          2. Online documents
                          3. Interactive exercises
                          4. Visual aids
                          5. Practice problems
                          Format as JSON with sections for each type.`;

            const response = await this.generateAssistantResponse(prompt, systemRole);
            const enrichedContent = JSON.parse(response);

            // Cache the results
            this.contentCache.set(cacheKey, enrichedContent);
            return enrichedContent;
        } catch (error) {
            console.error('Content enrichment error:', error);
            throw error;
        }
    }

    async generateLearningPath(topic, subject, gradeLevel) {
        try {
            const systemRole = "You are an educational curriculum designer.";
            const prompt = `Create a structured learning path for ${subject}, topic: ${topic}, grade level: ${gradeLevel}.
                          Include:
                          1. Prerequisites
                          2. Learning objectives
                          3. Key concepts
                          4. Suggested timeline
                          5. Assessment methods
                          Format as JSON.`;

            const response = await this.generateAssistantResponse(prompt, systemRole);
            return JSON.parse(response);
        } catch (error) {
            console.error('Learning path generation error:', error);
            throw error;
        }
    }

    async findRelatedContent(content) {
        try {
            const systemRole = "You are a content recommendation system.";
            const prompt = `Based on this content: ${content}
                          Find related:
                          1. Academic papers
                          2. Educational websites
                          3. Online courses
                          4. Educational games
                          5. Learning tools
                          Format as JSON with URLs and descriptions.`;

            const response = await this.generateAssistantResponse(prompt, systemRole);
            return JSON.parse(response);
        } catch (error) {
            console.error('Related content search error:', error);
            throw error;
        }
    }

    async generateInteractiveExercises(topic, difficulty = 'medium') {
        try {
            const systemRole = "You are an educational exercise generator.";
            const prompt = `Create interactive exercises for topic: ${topic}, difficulty: ${difficulty}.
                          Include:
                          1. Multiple choice questions
                          2. Problem-solving exercises
                          3. Practice activities
                          4. Discussion topics
                          5. Project ideas
                          Format as JSON with complete exercise details.`;

            const response = await this.generateAssistantResponse(prompt, systemRole);
            return JSON.parse(response);
        } catch (error) {
            console.error('Exercise generation error:', error);
            throw error;
        }
    }

    async suggestTeachingMaterials(subject, topic) {
        try {
            const safeSubject = await this.analyzeContent(subject);
            const safeTopic = await this.analyzeContent(topic);
            
            // Get enriched content
            const enrichedContent = await this.enrichContent(safeTopic, safeSubject, 'all');
            
            // Get learning path
            const learningPath = await this.generateLearningPath(safeTopic, safeSubject, 'all');
            
            // Get related content
            const relatedContent = await this.findRelatedContent(`${safeSubject} ${safeTopic}`);
            
            // Get interactive exercises
            const exercises = await this.generateInteractiveExercises(safeTopic);
            
            // Combine all resources
            const allResources = {
                enrichedContent,
                learningPath,
                relatedContent,
                exercises,
                lastUpdated: new Date().toISOString()
            };

            return JSON.stringify(allResources, null, 2);
        } catch (error) {
            console.error('Failed to suggest teaching materials:', error);
            throw error;
        }
    }

    // Enhanced chapter methods
    async generateChapterContent(subject, topic, gradeLevel) {
        try {
            const enrichedContent = await this.enrichContent(topic, subject, gradeLevel);
            const learningPath = await this.generateLearningPath(topic, subject, gradeLevel);
            const exercises = await this.generateInteractiveExercises(topic);

            return {
                content: enrichedContent,
                path: learningPath,
                exercises: exercises,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            console.error('Chapter content generation error:', error);
            throw error;
        }
    }

    async validateContentQuality(content) {
        try {
            const systemRole = "You are a content quality assessment system.";
            const prompt = `Evaluate this educational content for:
                          1. Academic accuracy
                          2. Age appropriateness
                          3. Educational value
                          4. Engagement level
                          5. Content completeness
                          Content: ${content}
                          Return JSON with scores and recommendations.`;

            const response = await this.generateAssistantResponse(prompt, systemRole);
            return JSON.parse(response);
        } catch (error) {
            console.error('Content validation error:', error);
            throw error;
        }
    }

    async generateProgressReport(studentData) {
        try {
            // First analyze the data for any anomalies
            await this.detectAnomalies(studentData);
            const prompt = `Generate a progress report based on this student data: ${JSON.stringify(studentData)}`;
            return await this.generateAssistantResponse(prompt);
        } catch (error) {
            console.error('Failed to generate progress report:', error);
            throw error;
        }
    }

    // System Health Check
    async performSystemHealthCheck() {
        try {
            const systemRole = "You are a system health monitoring service.";
            const healthData = {
                securityEvents: this.securityLogs.length,
                services: this.serviceStatus,
                lastCheck: new Date().toISOString()
            };
            const prompt = `Perform a system health check based on this data: ${JSON.stringify(healthData)}`;
            return await this.generateAssistantResponse(prompt, systemRole);
        } catch (error) {
            this.logSecurityEvent('health_check_error', error.message);
            throw error;
        }
    }
}

export const openAIService = new OpenAIService(); 