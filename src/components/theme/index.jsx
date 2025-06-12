/**
 * @fileoverview
 * Module containing React components for navigation menus in the application.
 * Loads all the components that make up the different menus of the control panel.
 * @module components/navigation/index
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.3.0
 * @requires ./Card
 * @requires ./CardDashboard
 * @requires ./CardUser
 * @requires ./MailTemplateWidget
 * @requires ./MessagesBlock
 * @requires ./Timeline
 * @requires ./UserWidget
 * @requires ./Mailbox
 * @requires ./Loading
 */

import Card from './Card.jsx';
import CardDashboard from './CardDashboard.jsx';
import CardUser from './CardUser.jsx';
import MailTemplateWidget from './MailTemplateWidget.jsx';
import MessagesBlock from './MessagesBlock.jsx';
import Timeline from './Timeline.jsx';
import UserWidget from './UserWidget.jsx';
import Mailbox from './Mailbox.jsx';
import Loading from './Loading.jsx';

export { 
    Card,
    CardDashboard,
    CardUser,
    MailTemplateWidget,
    MessagesBlock,
    Timeline,
    UserWidget,
    Mailbox,
    Loading
};
