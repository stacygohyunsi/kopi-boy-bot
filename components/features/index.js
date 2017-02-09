const Features = {
	CAFE_RANDOM: () => true,
	CAFE_LIST: () => false,
	CAFE_ADD: () => false,
	WITHIN_PROXIMITY_LIST: () => true,
	WITHIN_200M_LIST: () => false,
	WITHIN_500M_LIST: () => false,
	WITHIN_2KM_LIST: () => false,
	WITHIN_PROXIMITY_RANDOM: () => true,
	WITHIN_200M_RANDOM: () => true,
	WITHIN_500M_RANDOM: () => false,
	WITHIN_2KM_RANDOM: () => false,
	WITHIN_COUNTRY_RANDOM: () => true,
};

module.exports = Features;