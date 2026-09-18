import { world } from '@minecraft/server';

world.beforeEvents.chatSend.subscribe((event) => {
    const { sender, message } = event;

    if (message === '!hello') {
        event.cancel = true;
        sender.sendMessage('Hello from {{ADDON_NAME}}!');
    }
});

console.log('{{ADDON_NAME}} loaded successfully!');
