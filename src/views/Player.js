import { useContext, useState } from "react";
import {
	clearQueue,
	playedIncrement,
	removeMusic,
} from "../services/queue.service";
import { Button, Col, ListGroup, ListGroupItem, Row } from "reactstrap";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faBackwardStep,
	faForwardStep,
	faTrash,
	faXmark,
} from "@fortawesome/free-solid-svg-icons";
import {
	playAlgorithm,
	playIndex,
	playNextVideo,
	playPrevVideo,
} from "../services/playlist.service";
import { secondFormatting } from "../services/utility.module";
import ReactPlayer from "react-player";
import { NowPlayingContext, QueueContext } from "../App";
import SmartAddMusicInput from "../components/SmartAddMusicInput";

const Player = () => {
	const [queues] = useContext(QueueContext);
	const [nowPlaying] = useContext(NowPlayingContext);
	const [loading, setloading] = useState(false);

	const handleReady = () => {};

	const handleEnd = () => {
		playedIncrement(queues[nowPlaying.current_index].queue_id).then(
			(response) => {
				console.log(response);
				return playAlgorithm(1);
			}
		);
		console.log("End");
	};

	const handleClear = () => {
		setloading(true);
		Swal.fire({
			title: "Are you sure that you want to clear all music in playlist?",
			text: "This will remove all music, and you won't be able to revert this!",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#d33",
			confirmButtonText: "Yes, clear it!",
		}).then((result) => {
			setloading(false);
			if (result.isConfirmed) {
				clearQueue().then(() => {
					Swal.fire(
						"Success!",
						"Your playlist is now empty.",
						"success"
					);
				});
			}
		});
	};

	const confirmationRemoveMusic = (queue_id) => {
		Swal.fire({
			title: "Remove Warning",
			text: "Are you sure that you want to remove this music?",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#d33",
			confirmButtonText: "Yes",
		}).then((result) => {
			if (result.isConfirmed) {
				removeMusic(queue_id);
			}
		});
	};

	return (
		<div className="App">
			<h1 className="my-12 themed-color">TURN UP THE MUSIC</h1>
			<div className="">
				<div className="" style={{ width: "99%" }}>
					<Row className="my-2">
						<Col xs={12} md={6}>
							{/* {nowPlaying && <h4 className='text-white'>Now Playing: {nowPlaying.current.title}</h4>} */}
							<div className="flex justify-end">
								<div className="themed-border">
									<ReactPlayer
										light={true}
										controls
										playing
										url={`https://www.youtube.com/watch?v=${
											queues.length > 0 &&
											nowPlaying &&
											queues[nowPlaying.current_index]
												.video.youtube_id
										}`}
										// url="https://www.twitch.tv/videos/1768582540"
										onReady={(e) => handleReady(e)}
										onEnded={(e) => handleEnd(e)}
									/>
								</div>
							</div>
							<div className="flex justify-end mt-3">
								<Button
									color="light"
									onClick={() => playPrevVideo()}
								>
									<FontAwesomeIcon
										icon={faBackwardStep}
										className="mr-0  "
									/>{" "}
									Prev
								</Button>
								<Button
									color="light"
									className="mx-2"
									onClick={() => playNextVideo()}
								>
									Next{" "}
									<FontAwesomeIcon
										icon={faForwardStep}
										className="ml-0"
									/>
								</Button>
								<Button
									className="text-white"
									disabled={loading}
									onClick={handleClear}
									color="danger"
								>
									<FontAwesomeIcon
										icon={faTrash}
										className="mr-2"
									/>
									Clear Queue
								</Button>
							</div>
						</Col>
						<Col className="w-1/2">
							<div className="mb-2">
								{/* <AddMusicPopup/> */}
								<SmartAddMusicInput />
							</div>

							<h4 className="text-white text-start">
								Playlist ({queues.length})
							</h4>
							<ListGroup
								style={{
									height: "330px",
									overflowY: "scroll",
									width: "100%",
								}}
							>
								{queues.map((music, index) => (
									<ListGroupItem
										key={index}
										className="text-base text-left bg-grey "
										active={
											nowPlaying &&
											index === nowPlaying.current_index
										}
									>
										<Row>
											<Col
												xs={10}
												className="cursor-pointer"
												onClick={() => {
													playIndex(1, index);
												}}
											>
												<Row>
													<Col xs={3} xl={2}>
														{music && (
															<img
																src={
																	music.video
																		.thumbnail
																}
																alt="Thumbnail"
															/>
														)}
													</Col>
													<Col className="text-clip">
														<p className="mb-0">
															{music.video.title}
														</p>
														<p className="mb-0 text-gray-400">
															{
																music.video
																	.channel_title
															}
														</p>
													</Col>
												</Row>
											</Col>

											<Col
												xs={1}
												className="flex justify-end cursor-default"
											>
												{secondFormatting(
													music.video.duration
												)}
											</Col>
											<Col xs={1}>
												<Button
													color="danger"
													onClick={() => {
														confirmationRemoveMusic(
															music.queue_id
														);
													}}
												>
													<FontAwesomeIcon
														icon={faXmark}
													/>
												</Button>
											</Col>
										</Row>
									</ListGroupItem>
								))}
							</ListGroup>
						</Col>
					</Row>

					<div className="flex justify-end items-end">
                        <h3 className="pb-2 themed-color">Scan to add your music !</h3>
						<img
							src={require("../imgs/qr_code.png")}
							alt="QR Code"
							className="w-1/6"
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Player;
