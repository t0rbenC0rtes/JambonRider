import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore, BAG_STATUS } from "../store/useStore";
import "./Homepage.css";

const Homepage = () => {
	const navigate = useNavigate();
	const { bags, getBagStatus } = useStore();
	const [searchQuery, setSearchQuery] = useState("");
	const [searchResults, setSearchResults] = useState([]);
	const [showResults, setShowResults] = useState(false);

	const handleSearch = () => {
		if (!searchQuery.trim()) {
			setSearchResults([]);
			setShowResults(false);
			return;
		}

		const query = searchQuery.toLowerCase();
		const results = [];

		bags.forEach((bag) => {
			const bagStatus = getBagStatus(bag.id);
			
			// Check if bag name matches
			if (bag.name.toLowerCase().includes(query)) {
				results.push({
					type: "bag",
					bagName: bag.name,
					bagId: bag.id,
					status: bagStatus,
					matchedOn: "Nom du sac"
				});
			}

			// Check items in this bag
			bag.items?.forEach((item) => {
				let matchedOn = [];
				
				if (item.name.toLowerCase().includes(query)) {
					matchedOn.push("Nom");
				}
				if (item.description?.toLowerCase().includes(query)) {
					matchedOn.push("Description");
				}
				if (item.tags?.some(tag => tag.toLowerCase().includes(query))) {
					matchedOn.push("Tag");
				}

				if (matchedOn.length > 0) {
					results.push({
						type: "item",
						bagName: bag.name,
						bagId: bag.id,
						itemName: item.name,
						itemId: item.id,
						status: bagStatus,
						checked: item.checked,
						matchedOn: matchedOn.join(", ")
					});
				}
			});
		});

		setSearchResults(results);
		setShowResults(true);
	};

	const handleKeyPress = (e) => {
		if (e.key === "Enter") {
			handleSearch();
		}
	};

	const getStatusLabel = (status) => {
		switch (status) {
			case BAG_STATUS.LOADED:
				return "✅ Chargé";
			case BAG_STATUS.READY:
				return "✓ Prêt";
			case BAG_STATUS.EMPTY:
			default:
				return "Vide";
		}
	};

	return (
		<div className="homepage">
			<div className="homepage-content">
				<h1 className="homepage-title">JambonRider</h1>
				<p className="homepage-subtitle">Merci pour ton aide fieu</p>

				<div className="homepage-buttons">
					<button
						className="homepage-button load primary"
						onClick={() => navigate("/load")}
					>
						<span className="homepage-button-text">
							<span className="homepage-button-icon">📦</span>
							Charger
						</span>
					</button>

					<button
						className="homepage-button admin"
						onClick={() => navigate("/admin")}
					>
						<span className="homepage-button-text">
							<span className="homepage-button-icon">⚙️</span>
							Admin
						</span>
					</button>
				</div>

				<div className="homepage-search">
					<h3 className="homepage-search-title">🔍 Rechercher un objet</h3>
					<div className="homepage-search-box">
						<input
							type="text"
							placeholder="Entrez un mot-clé..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							onKeyPress={handleKeyPress}
							className="homepage-search-input"
						/>
						<button onClick={handleSearch} className="homepage-search-button">
							Rechercher
						</button>
					</div>

					{showResults && (
						<div className="homepage-search-results">
							{searchResults.length === 0 ? (
								<p className="homepage-no-results">
									Aucun résultat pour "{searchQuery}"
								</p>
							) : (
								<>
									<p className="homepage-results-count">
										{searchResults.length} résultat{searchResults.length > 1 ? "s" : ""} trouvé{searchResults.length > 1 ? "s" : ""}
									</p>
									<div className="homepage-results-list">
										{searchResults.map((result, index) => (
											<div key={index} className="homepage-result-item">
												{result.type === "bag" ? (
													<>
														<div className="homepage-result-header">
															<span className="homepage-result-icon">🎒</span>
															<strong>{result.bagName}</strong>
														</div>
														<div className="homepage-result-meta">
															Trouvé dans : {result.matchedOn}
														</div>
													</>
												) : (
													<>
														<div className="homepage-result-header">
															<span className="homepage-result-icon">
																{result.checked ? "✅" : "📦"}
															</span>
															<strong>{result.itemName}</strong>
														</div>
														<div className="homepage-result-meta">
															Sac : {result.bagName}
															<br />
															Trouvé dans : {result.matchedOn}
															<br />
															Statut : {result.checked ? "Vérifié" : "Non vérifié"}
														</div>
													</>
												)}
												<div className="homepage-result-status">
													{getStatusLabel(result.status)}
												</div>
											</div>
										))}
									</div>
								</>
							)}
						</div>
					)}
				</div>

				<p className="homepage-footer">
					Mode Charger : Vérifier et charger le matériel
					<br />
					Mode Admin : Gérer les sacs et objets
				</p>
			</div>
		</div>
	);
};

export default Homepage;
