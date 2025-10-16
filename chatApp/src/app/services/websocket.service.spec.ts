import { TestBed } from '@angular/core/testing';
import { Socket, io } from 'socket.io-client';
import { WebsocketService } from './websocket.service';

describe('WebsocketService', () => {
  let service: WebsocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WebsocketService],
    });
    service = TestBed.inject(WebsocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a correctly formatted message object', () => {
    const mockUser = { id: 1, username: 'user1', avatar: 'avatar.png' }; // Mock user data
    const content = 'Test message'; // Message content
    const room = 'room1'; // Room identifier

    // Call the parseMessage function to create the message object
    const msgObject = service.parseMessage(content, 'message', mockUser, room);

    // Verify that the returned message object has the correct properties
    expect(msgObject.content).toBe(content);
    expect(msgObject.from).toBe(mockUser.id);
    expect(msgObject.username).toBe(mockUser.username);
    expect(msgObject.room).toBe(room);
    expect(msgObject.avatar).toBe(mockUser.avatar);
    expect(msgObject.type).toBe('message');
  });

  it('should include the current time in the message object', () => {
    const mockUser = { id: 1, username: 'user1', avatar: 'avatar.png' };
    const content = 'Check the time';
    const room = 'room1';

    // Call the parseMessage function to create the message object
    const msgObject = service.parseMessage(content, 'message', mockUser, room);
    const timeParts = msgObject.time.split(':'); // Split time into hours and minutes

    // Check if time is in "HH:MM" format
    expect(timeParts.length).toBe(2); // Expect two parts (hours and minutes)
    expect(parseInt(timeParts[0], 10)).toBeGreaterThanOrEqual(0); // Hours should be >= 0
    expect(parseInt(timeParts[0], 10)).toBeLessThan(24); // Hours should be < 24
    expect(parseInt(timeParts[1], 10)).toBeGreaterThanOrEqual(0); // Minutes should be >= 0
    expect(parseInt(timeParts[1], 10)).toBeLessThan(60); // Minutes should be < 60
  });

  it('should correctly handle different content types', () => {
    const mockUser = { id: 1, username: 'user1', avatar: 'avatar.png' };
    const content = 'Image sent'; // Example of different content
    const room = 'room1';

    // Call the parseMessage function to create the message object
    const msgObject = service.parseMessage(content, 'image', mockUser, room);

    // Verify that the type is set correctly
    expect(msgObject.type).toBe('image'); // Expect type to be 'image'
    expect(msgObject.content).toBe(content); // Content should match
  });

  it('should handle empty content gracefully', () => {
    const mockUser = { id: 1, username: 'user1', avatar: 'avatar.png' };
    const content = ''; // Empty content
    const room = 'room1';

    // Call the parseMessage function to create the message object
    const msgObject = service.parseMessage(content, 'message', mockUser, room);

    // Verify that the message object is still correctly formatted even with empty content
    expect(msgObject.content).toBe(''); // Content should be an empty string
    expect(msgObject.from).toBe(mockUser.id); // User ID should still be present
    expect(msgObject.username).toBe(mockUser.username); // Username should be preserved
    expect(msgObject.room).toBe(room); // Room should be preserved
    expect(msgObject.type).toBe('message'); // Type should remain as 'message'
  });
});
