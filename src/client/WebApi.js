const axios = require('axios');
const { EventEmitter } = require("events");
const { WebApiError } = require('../handlers/error');

class WebApi extends EventEmitter {
  constructor() {
    super();

    this.endpoint = `https://webapi.highrise.game/`;
    this.sort_order = ['asc', 'desc'];
  }

  /**
   * Retrieve the profile of a user.
   *
   * @param {string} user_id - The ID of the user.
   * @returns {Object} The user's profile.
   */
  async getUserProfile(user_id) {

    // Send the API request to retrieve the user profile
    let endpoint = `${this.endpoint}users`;
    if (user_id) {
      endpoint += `/${user_id}`;
    };

    try {
      const response = await axios.get(endpoint);
      const profile = response.data;

      return profile; // Return the retrieved user profile
    } catch (error) {
      return null;
    }
  }

  /**
 * Retrieves users from the API based on the specified parameters.
 *
 * @param {string|null} username - The username to filter the users by.
 * @param {number} limit - The maximum number of users to retrieve.
 * @param {string|null} starts_after - The user ID to start retrieving users after.
 * @param {string|null} ends_before - The user ID to end retrieving users before.
 * @param {string} sort_order - The sort order for the retrieved users.
 * @returns {Promise<object|null>} - A promise that resolves with the retrieved users or null.
 */
  async getUsers(username = null, limit = 20, starts_after = null, ends_before = null, sort_order = "asc") {
    let endpoint = `${this.endpoint}users?`;

    // Validate the limit parameter
    if (limit && (isNaN(limit) || typeof limit !== 'number')) {
      throw new WebApiError(`[WARNING]: Invalid limit. The limit value must be a number.`.red);
    }

    // Validate the sort_order parameter
    if (sort_order && !this.sort_order.includes(sort_order)) {
      throw new WebApiError(`[WARNING]: Invalid sort_order. Available Orders:\n${this.sort_order.join("\n")}`);
    }

    if (username) {
      endpoint += `&username=${username}`;
    }

    if (sort_order) {
      endpoint += `&sort_order=${sort_order}`;
    }

    if (starts_after) {
      endpoint += `&starts_after=${starts_after}`;
    }

    if (ends_before) {
      endpoint += `&ends_before=${ends_before}`;
    }

    try {
      // Send the API request to retrieve user data
      const response = await axios.get(endpoint);
      const users = response.data;

      return users || null;
    } catch (error) {
      // Handle any errors that occurred during the request
      return null;
    }
  }

  /**
  * Retrieve a list of rooms based on the specified parameters.
  *
  * @param {string} owner_id - The ID of the user who owns the rooms you want to retrieve.
  * @param {number} limit - The maximum number of rooms to retrieve per request.
  * @param {string|null} starts_after - The ID of the room from which to start the query. This is useful for paginating results.
  * @param {string} sort_order - Determines the order in which results are returned. Can be either "asc" for ascending order or "desc" for descending order.
  * @returns {Promise<Array>} - A Promise that resolves to the list of rooms.
  */
  async getRooms(owner_id, limit = 20, starts_after = null, ends_before = null, sort_order = "asc") {

    // Validate the limit parameter
    if (limit && (isNaN(limit) || typeof limit !== 'number')) {
      throw new WebApiError(`[WARNING]: Invalid limit. The limit value must be a number.`.red);
    }

    // Validate the sort_order parameter
    if (sort_order && !this.sort_order.includes(sort_order)) {
      throw new WebApiError(`[WARNING]: Invalid sort_order. Available Orders:\n${this.sort_order.join("\n")}`);
    }

    // Build the API endpoint URL
    let endpoint = `${this.endpoint}rooms?limit=${limit}&sort_order=${sort_order}`;
    if (starts_after) {
      endpoint += `&starts_after=${starts_after}`;
    }
    if (ends_before) {
      endpoint += `&ends_before=${ends_before}`;
    }
    if (owner_id) {
      endpoint += `&owner_id=${owner_id}`;
    }

    try {
      // Send the API request to retrieve room data
      const response = await axios.get(endpoint);
      const roomList = response.data;

      return roomList || null
    } catch (error) {
      // Handle any errors that occurred during the request
      return null;
    }
  }

  /**
  * Retrieve a list of newsfeed posts based on the specified parameters.
  *
  * @param {string} author_id - The ID of the author whose posts you want to retrieve.
  * @param {number} limit - The maximum number of posts to retrieve per request.
  * @param {string} starts_after - The ID of the post from which to start the query. This is useful for paginating results.
  * @param {string} sort_order - Determines the order in which results are returned. Can be either "asc" for ascending order or "desc" for descending order.
  * @returns {Promise<Array>} - A Promise that resolves to an array of newsfeed posts.
  */
  async getNewsfeedPosts(author_id, limit = 20, starts_after = null, ends_before = null, sort_order = "asc") {

    // Validate the author_id
    if (!author_id || typeof author_id !== 'string') {
      throw new WebApiError(`[WARNING]: Invalid author_id. Please provide a valid author_id`.red);
    };

    // Validate the limit parameter
    if (limit && (isNaN(limit) || typeof limit !== 'number')) {
      throw new WebApiError(`[WARNING]: Invalid limit. The limit value must be a number.`.red);
    }

    // Validate the sort_order parameter
    if (sort_order && !this.sort_order.includes(sort_order)) {
      throw new WebApiError(`[WARNING]: Invalid sort_order. Available Orders:\n${this.sort_order.join("\n")}`);
    }

    let endpoint = `${this.endpoint}posts?limit=${limit}&sort_order=${sort_order}&author_id=${author_id}`;
    if (starts_after) {
      endpoint += `&starts_after=${starts_after}`;
    }
    if (ends_before) {
      endpoint += `&ends_before=${ends_before}`;
    }

    try {

      const response = await axios.get(endpoint);
      const postList = response.data;

      if (postList.posts.length === 0) {
        return null;
      }

      return postList
    } catch (error) {
      return null;
    }
  }

  /**
   * Retrieve the home spawn room of a user.
   *
   * @param {string} owner_id - The ID of the user.
   * @returns {Object|null} The home spawn room object or null if not found.
   */
  async getHomeSpawnRoom(owner_id) {
    try {
      let startAfter = null;
      let homeSpawnRoom = null;

      // Keep iterating until the homeSpawnRoom is found or there are no more rooms
      while (!homeSpawnRoom) {
        // Send the API request to retrieve rooms, starting after the specified room ID
        const response = await axios.get(`${this.endpoint}rooms`, {
          params: {
            owner_id,
            limit: 50,
            starts_after: startAfter,
          },
        });

        const rooms = response.data.rooms;
        // Find the home spawn room in the retrieved rooms
        homeSpawnRoom = rooms.find((room) => room.is_home_room);

        if (!homeSpawnRoom) {
          // If homeSpawnRoom is not found, set the startAfter value to the ID of the last room in the response
          const lastRoom = rooms[rooms.length - 1];
          if (!lastRoom) break;

          startAfter = lastRoom.room_id;
        }
      }

      return homeSpawnRoom
    } catch (error) {
      return null;
    }
  }

  /**
  * Retrieve a specific post based on the given post ID.
  *
  * @param {string} post_id - The ID of the post to retrieve.
  * @returns {Promise<Object>} - A Promise that resolves to the retrieved post.
  */
  async getPost(post_id) {

    if (!post_id) {
      throw new Error("Invalid post ID. Please provide a valid post ID.".red);
    }

    let endpoint = `${this.endpoint}posts/${post_id}`;

    try {
      const response = await axios.get(endpoint);
      const post = response.data;

      return post
    } catch (error) {
      return null;
    }
  }

  /**
  * Retrieves a grab by its ID.
  * @param {string|null} grab_id - The ID of the grab to retrieve. If null, retrieves all grabs.
  * @returns {Object|null} - The retrieved grab object, or null if not found.
  */
  async getGrab(grab_id) {

    if (!grab_id) {
      throw new Error("Invalid grab ID. Please provide a valid grab ID.".red);
    }
    // Construct the endpoint URL
    let endpoint = `${this.endpoint}grabs/${grab_id}`;
    try {
      // Send a GET request to the endpoint
      const response = await axios.get(endpoint);
      const grab = response.data;

      // Return the retrieved grab or null if not found
      return grab
    } catch (error) {
      return null;
    }
  }

  /**
  * Retrieves an item by its ID.
  * @param {string} item_id - The ID of the item to retrieve.
  * @returns {Object|null} - The retrieved item object, or null if not found.
  */
  async getItem(item_id) {
    // Check if item_id is falsy
    if (!item_id) {
      // Handle the case when item_id is not provided
      throw new Error("Invalid item ID. Please provide a valid item ID.");
    }

    // Construct the endpoint URL using the item_id
    let endpoint = `${this.endpoint}items/${item_id}`;

    try {
      // Send a GET request to the endpoint
      const response = await axios.get(endpoint);
      const item = response.data;

      // Return the retrieved item or null if not found
      return item

    } catch (error) {
      return null;
    }
  }

  /**
  * Retrieves items based on specified parameters.
  * @param {string|null} item_name - The name of the item to filter by.
  * @param {string|null} rarity - The rarity of the items to filter by.
  * @param {string|null} category - The category of the items to filter by.
  * @param {number} limit - The maximum number of items to retrieve (default: 20).
  * @param {string|null} starts_after - The starting date to filter items after.
  * @param {string|null} ends_before - The ending date to filter items before.
  * @param {string} sort_order - The sort order for the items (default: "desc").
  * @returns {Array<Object>} - An array of item objects.
  */
  async getItems(item_name = null, rarity = null, limit = 20, category = null, starts_after = null, ends_before = null, sort_order = "desc") {
    // Initialize the base endpoint URL with the default parameters
    let endpoint = `${this.endpoint}items?limit=${limit}&sort_order=${sort_order}`;

    // Modify the endpoint URL based on the provided parameters
    if (item_name) {
      endpoint += `&item_name=${item_name}`;
    }
    if (rarity) {
      endpoint += `&rarity=${rarity}`;
    }
    if (category) {
      endpoint += `&category=${category}`;
    }
    if (starts_after) {
      endpoint += `&starts_after=${starts_after}`;
    }
    if (ends_before) {
      endpoint += `&ends_before=${ends_before}`;
    }

    try {
      // Send a GET request to the endpoint
      const response = await axios.get(endpoint);
      const items = response.data;

      // Return the array of item objects
      return items;
    } catch (error) {
      return null;
    }
  }


  /**
  * Retrieves grabs based on specified parameters.
  * @param {string|null} title - The title to filter grabs by.
  * @param {number} limit - The maximum number of grabs to retrieve (default: 20).
  * @param {string|null} starts_after - The starting date to filter grabs after.
  * @param {string|null} ends_before - The ending date to filter grabs before.
  * @param {string} sort_order - The sort order for the grabs (default: "desc").
  * @returns {Array<Object>} - An array of grabbed objects.
  */
  async getGrabs(title = null, limit = 20, starts_after = null, ends_before = null, sort_order = "desc") {
    // Construct the endpoint URL with query parameters
    let endpoint = `${this.endpoint}grabs?limit=${limit}&sort_order=${sort_order}`;
    if (title) {
      endpoint += `&title=${title}`;
    }
    if (starts_after) {
      endpoint += `&starts_after=${starts_after}`;
    }
    if (ends_before) {
      endpoint += `&ends_before=${ends_before}`;
    }

    try {
      // Send a GET request to the endpoint
      const response = await axios.get(endpoint);
      const grabs = response.data;

      // Return the array of grabbed objects
      return grabs;
    } catch (error) {
      return null;
    }
  }


  /**
  * Retrieve a room's data based on the specified room_id.
  *
  * @param {string} room_id - The ID of the room you want to retrieve data for.
  * @returns {Promise<Object>} - A Promise that resolves to the room data.
  */
  async getRoomData(room_id) {
    try {

      let endpoint = `${this.endpoint}rooms`;
      if (room_id) {
        endpoint += `/${room_id}`;
      };

      const response = await axios.get(endpoint);
      const roomData = response.data;

      return roomData
    } catch (error) {
      return null;
    }
  }

  player = {
    room: {
      /**
      * Get the data of a specific room by its ID.
      *
      * @param {string} room_id - The ID of the room to retrieve.
      * @returns {object} The retrieved room data.
      */
      get: async (room_id) => {
        try {
          const room = await this.getRoomData(room_id);
          return room;
        } catch (error) {
          return null;
        }
      }
    },
    post: {
      /**
      * Get a specific post by its ID.
      *
      * @param {string} post_id - The ID of the post to retrieve.
      * @returns {object} The retrieved post object.
      */
      get: async (post_id) => {
        try {
          const post = await this.getPost(post_id);
          return post
        } catch (error) {
          return null;
        }
      }
    },
    posts: {
      /**
      * Get a list of posts based on the provided parameters.
      *
      * @param {string} author_id - The ID of the author whose posts to retrieve.
      * @param {number} limit - The maximum number of posts to retrieve. Default: 10.
      * @param {string|null} starts_after - The ID of the post to start retrieving from.
      * @param {string} sort_order - The sort order of the posts. Default: "asc".
      * @returns {object} The retrieved posts object.
      */
      get: async (author_id, limit, starts_after, sort_order) => {
        try {
          const posts = await this.getNewsfeedPosts(author_id, limit, starts_after, sort_order);
          return posts
        } catch (error) {
          return null;
        }
      }
    },
    spawn: {
      /**
       * Get the home spawn room for a given owner ID
       * @param {string} owner_id - The ID of the user who owns the home spawn
       * @returns {Object|null} - The home spawn room object, or null if not found
       */
      get: async (owner_id) => {
        try {
          const spawn = await this.getHomeSpawnRoom(owner_id);
          return spawn;
        } catch (error) {
          return null;
        }
      }
    },
    rooms: {
      /**
       * Get a list of rooms for a given owner ID with optional parameters
       * @param {string} owner_id - The ID of the user who owns the rooms
       * @param {number} limit - The maximum number of rooms to retrieve per request
       * @param {string|null} starts_after - The ID of the room to start the query after
       * @param {string} sort_order - The order in which results are returned (asc or desc)
       * @returns {Array} - The list of rooms
       */
      get: async (owner_id, limit, starts_after, sort_order) => {
        try {
          const rooms = await this.getRooms(owner_id, limit, starts_after, sort_order);
          return rooms;
        } catch (error) {
          return null;
        }
      }
    },
    profile: {
      /**
       * Retrieve the full profile of a user.
       *
       * @param {string} user_id - The ID of the user.
       * @returns {Object} The user's full profile.
       */
      get: async (user_id) => {
        try {
          const profile = await this.getUserProfile(user_id);
          return profile;
        } catch (error) {
          return null;
        }
      },
    },
    username: {
      /**
       * Retrieve the username of a user.
       *
       * @param {string} user_id - The ID of the user.
       * @returns {string} The username of the user.
       */
      get: async (user_id) => {
        const profile = await this.getUserProfile(user_id);
        return profile.user.username;
      },
    },
    outfit: {
      /**
      * Retrieve the outfit of a user.
      *
      * @param {string} user_id - The ID of the user.
      * @returns {Array} The outfit of the user.
      */
      get: async (user_id) => {
        const profile = await this.getUserProfile(user_id);
        return profile.user.outfit;
      },
    },

    stats: {
      /**
      * Retrieve the stats of a user.
      *
      * @param {string} user_id - The ID of the user.
      * @returns {Object} The stats of the user, including followers, following, and friends counts.
      */
      get: async (user_id) => {
        const profile = await this.getUserProfile(user_id);
        return {
          followers: profile.user.num_followers,
          following: profile.user.num_following,
          friends: profile.user.num_friends,
        };
      },
    },
    crew: {
      /**
      * Retrieve the crew details of a user.
      *
      * @param {string} user_id - The ID of the user.
      * @returns {Object} The crew details of the user, including ID and name.
      */
      get: async (user_id) => {
        const profile = await this.getUserProfile(user_id);
        return {
          id: profile.user.crew.id,
          name: profile.user.crew.name,
        };
      },
    },
    date: {
      /**
      * Retrieve the join date and last online date of a user.
      *
      * @param {string} user_id - The ID of the user.
      * @returns {Object} The join date and last online date of the user.
      */
      get: async (user_id) => {
        const profile = await this.getUserProfile(user_id);
        return {
          joined: profile.user.joined_at,
          last_online: profile.user.last_online_in,
        };
      },
    },
    voice: {
      /**
       * Check if voice is enabled for a user.
       *
       * @param {string} user_id - The ID of the user.
       * @returns {boolean} `true` if voice is enabled for the user, `false` otherwise.
       */
      get: async (user_id) => {
        const profile = await this.getUserProfile(user_id);
        return profile.user.voice_enabled;
      },
    },
  };
}

module.exports = WebApi;
