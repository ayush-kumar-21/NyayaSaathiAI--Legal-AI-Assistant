/**
 * Police Escalation Inbox Page
 * Thin wrapper around the shared EscalationInbox component
 */
import React from 'react';
import EscalationInbox from '../../../shared/components/EscalationInbox';

const PoliceEscalationInbox: React.FC = () => {
    return <EscalationInbox role="police" />;
};

export default PoliceEscalationInbox;
