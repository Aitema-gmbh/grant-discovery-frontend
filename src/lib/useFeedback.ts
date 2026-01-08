/**
 * useFeedback Composable
 * 
 * Provides hooks for tracking user interactions with grants,
 * matches, and proposals for the Layer 5 Learning System.
 */

import { ref } from 'vue'
import api from '@/services/api'
import { useAuthStore } from '@/stores/auth'

// Session ID for tracking
const sessionId = ref<string>(generateSessionId())

function generateSessionId(): string {
    return `sess_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`
}

export function useFeedback() {
    const authStore = useAuthStore()

    // Get user ID from auth or use anonymous
    const getUserId = () => authStore.user?.id || 'anonymous'

    /**
     * Track a page view event
     */
    async function trackPageView(page: string, targetType?: string, targetId?: string) {
        try {
            await api.post('/api/events/track', {
                session_id: sessionId.value,
                event_type: 'page_view',
                page,
                target_type: targetType,
                target_id: targetId,
                metadata: {
                    referrer: document.referrer,
                    timestamp: new Date().toISOString()
                }
            }, {
                headers: { 'x-user-id': getUserId() }
            })
        } catch (e) {
            console.debug('Failed to track page view:', e)
        }
    }

    /**
     * Track a search event
     */
    async function trackSearch(query: string, resultCount: number, filters?: Record<string, unknown>) {
        try {
            await api.post('/api/events/track', {
                session_id: sessionId.value,
                event_type: 'search',
                page: 'grants',
                metadata: {
                    query,
                    result_count: resultCount,
                    filters,
                    timestamp: new Date().toISOString()
                }
            }, {
                headers: { 'x-user-id': getUserId() }
            })
        } catch (e) {
            console.debug('Failed to track search:', e)
        }
    }

    /**
     * Track grant action (view, save, apply, dismiss, expand)
     */
    async function trackGrantAction(
        grantId: string,
        action: 'view' | 'save' | 'apply' | 'dismiss' | 'expand' | 'share',
        context?: { source_page?: string; match_score?: number; time_on_page?: number }
    ) {
        try {
            await api.post('/api/feedback/grant-action', {
                grant_id: grantId,
                action,
                context: {
                    ...context,
                    session_id: sessionId.value
                }
            }, {
                headers: { 'x-user-id': getUserId() }
            })
        } catch (e) {
            console.debug('Failed to track grant action:', e)
        }
    }

    /**
     * Submit a match rating
     */
    async function rateMatch(
        grantId: string,
        rating: number,
        options?: { csoId?: string; matchScore?: number; feedbackText?: string }
    ) {
        try {
            const response = await api.post('/api/feedback/match-rating', {
                grant_id: grantId,
                cso_id: options?.csoId,
                rating,
                match_score: options?.matchScore,
                feedback_text: options?.feedbackText
            }, {
                headers: { 'x-user-id': getUserId() }
            })
            return response.data
        } catch (e) {
            console.error('Failed to submit match rating:', e)
            throw e
        }
    }

    /**
     * Record proposal outcome
     */
    async function recordOutcome(
        proposalId: string,
        outcome: 'awarded' | 'rejected' | 'shortlisted' | 'withdrawn' | 'pending',
        details?: {
            amountAwarded?: number
            feedbackFromFunder?: string
            lessonsLearned?: string
            successFactors?: string[]
            failureReasons?: string[]
        }
    ) {
        try {
            const response = await api.post('/api/outcomes/record', {
                proposal_id: proposalId,
                outcome,
                amount_awarded: details?.amountAwarded,
                feedback_from_funder: details?.feedbackFromFunder,
                lessons_learned: details?.lessonsLearned,
                success_factors: details?.successFactors,
                failure_reasons: details?.failureReasons
            }, {
                headers: { 'x-user-id': getUserId() }
            })
            return response.data
        } catch (e) {
            console.error('Failed to record outcome:', e)
            throw e
        }
    }

    /**
     * Track filter change
     */
    async function trackFilter(filterName: string, filterValue: unknown) {
        try {
            await api.post('/api/events/track', {
                session_id: sessionId.value,
                event_type: 'filter',
                page: 'grants',
                metadata: {
                    filter_name: filterName,
                    filter_value: filterValue,
                    timestamp: new Date().toISOString()
                }
            }, {
                headers: { 'x-user-id': getUserId() }
            })
        } catch (e) {
            console.debug('Failed to track filter:', e)
        }
    }

    /**
     * Track download event
     */
    async function trackDownload(targetType: string, targetId: string, format: string) {
        try {
            await api.post('/api/events/track', {
                session_id: sessionId.value,
                event_type: 'download',
                target_type: targetType,
                target_id: targetId,
                metadata: {
                    format,
                    timestamp: new Date().toISOString()
                }
            }, {
                headers: { 'x-user-id': getUserId() }
            })
        } catch (e) {
            console.debug('Failed to track download:', e)
        }
    }

    return {
        sessionId,
        trackPageView,
        trackSearch,
        trackGrantAction,
        rateMatch,
        recordOutcome,
        trackFilter,
        trackDownload
    }
}
