/**
 * Judge Escalation Queue Page
 * Thin wrapper around the shared EscalationInbox component
 */
import React from 'react';
import EscalationInbox from '../../../shared/components/EscalationInbox';

const JudgeEscalationQueue: React.FC = () => {
    return <EscalationInbox role="judge" />;
};

export default JudgeEscalationQueue;
