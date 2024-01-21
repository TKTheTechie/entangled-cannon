/* eslint-disable @typescript-eslint/ban-ts-comment */
import { SOLACE_STATUS, SOLACE_STATUS_CODES } from '$lib/store/game-config';
import * as solace from 'solclientjs';
import { v4 as uuidv4 } from 'uuid';

//Convenience wrapper class to simplify Solace operations
class SolaceClient {
	//Solace session object
	private session: solace.Session = null;

	private messageConsumer: solace.MessageConsumer;

	private isConsuming = false;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	constructor() {
		//Initializing the solace client library
		const factoryProps = new solace.SolclientFactoryProperties();
		factoryProps.profile = solace.SolclientFactoryProfiles.version10;
		solace.SolclientFactory.init(factoryProps);
	}
	/**
	 * Asynchronous function that connects to the Solace Broker and returns a promise.
	 * Only required if a session isn't passed directly to this class
	 */
	connect(): Promise<string> {
		return new Promise((resolve, reject) => {
			const url = import.meta.env.VITE_SOLACE_URL;
			const vpnName = import.meta.env.VITE_SOLACE_VPN;
			const userName = import.meta.env.VITE_SOLACE_USER;
			const password = import.meta.env.VITE_SOLACE_PASSWORD;

			if (this.session != undefined) {
				console.warn('Already connected and ready to subscribe.');
			} else {
				// if there's no session, create one with the properties imported from the game-config file
				try {
					if (url.indexOf('ws') != 0) {
						reject(
							'HostUrl must be the WebMessaging Endpoint that begins with either ws:// or wss://. Please set appropriately!'
						);
						return;
					}

					this.session = solace.SolclientFactory.createSession({
						url,
						vpnName,
						userName,
						password,
						connectRetries: 3,
						publisherProperties: {
							enabled: true,
							acknowledgeMode: solace.MessagePublisherAcknowledgeMode.PER_MESSAGE
						}
					});
				} catch (error) {
					console.log(error.toString());
				}
				// define session event listeners

				//The UP_NOTICE dictates whether the session has been established
				this.session.on(solace.SessionEventCode.UP_NOTICE, () => {
					console.log('=== Successfully connected and ready to subscribe. ===');
					SOLACE_STATUS.set(SOLACE_STATUS_CODES.CONNECTED);
					resolve('Connected');
				});

				//The CONNECT_FAILED_ERROR implies a connection failure
				this.session.on(
					solace.SessionEventCode.CONNECT_FAILED_ERROR,
					(sessionEvent: solace.SessionEvent) => {
						console.log(
							'Connection failed to the message router: ' +
								sessionEvent.infoStr +
								' - check correct parameter values and connectivity!'
						);
						SOLACE_STATUS.set(SOLACE_STATUS_CODES.DISCONNECTED);
						reject(`Check your connection settings and try again!`);
					}
				);

				// connect the session
				try {
					this.session.connect();
				} catch (error) {
					console.log(error.toString());
				}
			}
		});
	}

	async disconnect() {
		return new Promise<void>((resolve, reject) => {
			console.log('Disconnecting from Solace message router...');

			//DISCONNECTED implies the client was disconnected
			this.session.on(solace.SessionEventCode.DISCONNECTED, () => {
				SOLACE_STATUS.set(SOLACE_STATUS_CODES.DISCONNECTED);
				console.log('Disconnected.');
				if (this.session !== null) {
					this.session.dispose();
					this.session = null;
					resolve();
				}
			});
			if (this.session !== null) {
				try {
					this.session.disconnect();
				} catch (error) {
					console.log(error.toString());
				}
			} else {
				console.log('Not connected to Solace message router.');
			}
		});
	}

	/**
	 * Convenience function to consume from a queue
	 *
	 * @param queueName Name of the queue to consume from
	 * @param callback The callback function for the message receipt
	 */
	consumeFromQueue(queueName: string) {
		if (this.session == null) {
			console.log('Not connected to Solace!');
		} else {
			if (this.isConsuming) console.warn(`Already connected to the queue ${queueName}`);
			else {
				this.messageConsumer = this.session.createMessageConsumer({
					queueDescriptor: { name: queueName, type: solace.QueueType.QUEUE },
					acknowledgeMode: solace.MessageConsumerAcknowledgeMode.CLIENT,
					createIfMissing: true
				});

				this.messageConsumer.on(solace.MessageConsumerEventName.UP, () => {
					console.log('Succesfully connected to and consuming from ' + queueName);
				});

				this.messageConsumer.on(solace.MessageConsumerEventName.CONNECT_FAILED_ERROR, () => {
					console.log('Consumer cannot bind to queue ' + queueName);
				});

				this.messageConsumer.on(solace.MessageConsumerEventName.DOWN, () => {
					console.log('The message consumer is down');
				});

				this.messageConsumer.on(solace.MessageConsumerEventName.DOWN_ERROR, () => {
					console.log('An error happend, the message consumer is down');
				});

				try {
					this.messageConsumer.connect();
					this.isConsuming = true;
				} catch (err) {
					console.log(
						'Cannot start the message consumer on queue ' + queueName + ' because: ' + err
					);
				}
			}
		}
	}

	/**
	 * Function that adds a subscription to a queue
	 * @param topicSubscription - topic subscription string to add to the queue
	 */
	public addSubscriptionToQueue(topicSubscription: string): Promise<void> {
		return new Promise((resolve, reject) => {
			const correlationKey = uuidv4();
			this.resolveRejectSubscriptionFunctions(correlationKey, resolve, reject);
			this.messageConsumer.addSubscription(
				solace.SolclientFactory.createTopicDestination(topicSubscription),
				correlationKey,
				1000
			);
		});
	}

	/**
	 * Function that removes a topic subscription from a queue
	 * @param topicSubscription Topic to be removed from the queue
	 */
	public removeSubscriptionFromQueue(topicSubscription: string): Promise<void> {
		return new Promise((resolve, reject) => {
			const correlationKey = uuidv4();
			this.resolveRejectSubscriptionFunctions(correlationKey, resolve, reject);
			this.messageConsumer.removeSubscription(
				solace.SolclientFactory.createTopicDestination(topicSubscription),
				correlationKey,
				1000
			);
		});
	}

	/**
	 * Convenience function to resolve or reject subscription actions based on the co-relationkey
	 * @param correlationKey the unique identifier for the subscription action
	 * @param resolve the resolve function
	 * @param reject the reject function
	 */
	private resolveRejectSubscriptionFunctions(
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		correlationKey: any,
		resolve: (value: void | PromiseLike<void>) => void,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		reject: (reason?: any) => void
	) {
		//The function to be called if the Ack happends
		const onAck = (evt: solace.MessageConsumerEvent) => {
			if (!evt || evt.correlationKey !== correlationKey) return;
			//@ts-ignore
			this.messageConsumer.removeListener(solace.MessageConsumerEventName.SUBSCRIPTION_OK, onAck);
			//@ts-ignore
			this.messageConsumer.removeListener(
				solace.MessageConsumerEventName.SUBSCRIPTION_ERROR,
				onNak
			);
			resolve();
		};

		//The function to be called if the action is rejected
		const onNak = (evt: solace.MessageConsumerEvent) => {
			if (!evt || evt.correlationKey !== correlationKey) return;
			//@ts-ignore
			this.messageConsumer.removeListener(solace.MessageConsumerEventName.SUBSCRIPTION_OK, onAck);
			//@ts-ignore
			this.messageConsumer.removeListener(
				solace.MessageConsumerEventName.SUBSCRIPTION_ERROR,
				onNak
			);
			reject();
		};

		//Add the relevant events
		//@ts-ignore
		this.messageConsumer.addListener(solace.MessageConsumerEventName.SUBSCRIPTION_OK, onAck);
		//@ts-ignore
		this.messageConsumer.addListener(solace.MessageConsumerEventName.SUBSCRIPTION_ERROR, onNak);
	}

	/**
	 *
	 * @param queueName Name of the queue to consume from
	 */
	stopConsumeFromQueue() {
		if (this.isConsuming) {
			this.messageConsumer.stop();
			this.isConsuming = false;
		}
	}

	/**
	 * Publish a guaranteed message on a topic
	 * @param topic Topic to publish on
	 * @param payload Payload on the topic
	 */
	async publishMessage(topic: string, payload: string): Promise<void> {
		return new Promise((resolve, reject) => {
			if (!this.session) {
				console.log('Cannot publish because not connected to Solace message router!');
				reject();
				return;
			}

			const binaryAttachment = new Blob([payload], {
				type: 'text/plain; charset=utf-8'
			}).arrayBuffer();
			const message = solace.SolclientFactory.createMessage();
			message.setDestination(solace.SolclientFactory.createTopicDestination(topic));
			binaryAttachment.then((buffer) => {
				const correlationKey = uuidv4();

				message.setCorrelationKey(correlationKey);
				message.setBinaryAttachment(new Uint8Array(buffer));
				message.setDeliveryMode(solace.MessageDeliveryModeType.PERSISTENT);

				//call to be made on succesful publish
				const onAck = (evt: solace.SessionEvent) => {
					if (!evt || evt.correlationKey !== correlationKey) {
						return;
					}
					//@ts-ignore
					this.session.removeListener(String(solace.SessionEventCode.ACKNOWLEDGED_MESSAGE), onAck);
					//@ts-ignore
					this.session.removeListener(
						String(solace.SessionEventCode.REJECTED_MESSAGE_ERROR),
						onNak
					);
					resolve();
				};

				//call to be made on rejected publish
				const onNak = (evt: solace.SessionEvent) => {
					console.log('Unsuccesfully published!');
					if (!evt || evt.correlationKey !== correlationKey) {
						return;
					}
					//@ts-ignore
					this.session.removeListener(String(solace.SessionEventCode.ACKNOWLEDGED_MESSAGE), onAck);
					//@ts-ignore
					this.session.removeListener(
						String(solace.SessionEventCode.REJECTED_MESSAGE_ERROR),
						onNak
					);
					reject();
				};

				try {
					//register the callbacks on publish
					this.session.on(solace.SessionEventCode.ACKNOWLEDGED_MESSAGE, onAck);
					this.session.on(solace.SessionEventCode.REJECTED_MESSAGE_ERROR, onNak);
					this.session.send(message);
				} catch (error) {
					//remove the callbacks on error
					//@ts-ignore
					this.session.removeListener(String(solace.SessionEventCode.ACKNOWLEDGED_MESSAGE), onAck);
					//@ts-ignore
					this.session.removeListener(
						String(solace.SessionEventCode.REJECTED_MESSAGE_ERROR),
						onNak
					);
					console.log(error);
					reject();
				}
			});
		});
	}
}

const solaceClient = new SolaceClient();

export default solaceClient;
