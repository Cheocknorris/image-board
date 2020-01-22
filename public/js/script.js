(function() {
    Vue.component("image-component", {
        template: "#modal",
        props: ["id"],
        data: function() {
            return { image: null, comment: null, username: null, comments: [] };
        },
        mounted: function() {
            console.log("component mounted: ");
            console.log("id: ", this.id);
            var vueInstance = this;
            axios
                .get("/selected/" + this.id)
                .then(function(results) {
                    console.log("results.data : ", results.data);
                    vueInstance.image = results.data[0];
                    console.log("vueInstance.images: ", vueInstance.image);
                })
                .catch(function(err) {
                    console.log("err: ", err);
                });

            axios
                .get("/comment/" + this.id)
                .then(function(results) {
                    console.log("comment results data: ", results.data);
                    vueInstance.comment = results.data;
                    console.log("vueInstance.comment :", vueInstance.comment);
                    for (var i in results.data) {
                        vueInstance.comments.push(results.data[i]);
                    }
                })
                .catch(function(err) {
                    console.log("err: ", err);
                });
        },

        methods: {
            handleComments: function(e) {
                e.preventDefault();
                console.log("button clicked");
                console.log("this:", this);
                console.log("username", this.username);
                console.log("comment:", this.comment);
                console.log("id: ", this.id);

                var vueInstance = this;

                axios
                    .post("/comment", {
                        username: this.username,
                        comment: this.comment,
                        id: this.id
                    })
                    .then(function(resp) {
                        console.log("resp from post/comment: ", resp);
                        vueInstance.comments.unshift(resp.data[0]);
                    })
                    .catch(err => {
                        console.log("err in resp/upload: ", err);
                    });
            }
        }
    });

    new Vue({
        el: "#main",
        data: {
            selectedImage: null,
            heading: "IMAGE BOARD",
            images: [],
            title: "",
            description: "",
            username: "",
            file: null,
            classMainContainer: "main-container",
            classContainer: "container",
            classPicture: "picture",
            classTitle: "title"
            // fruits: [
            //     {
            //         title: "🥝",
            //         id: 1
            //     },
            //     {
            //         title: "🍓",
            //         id: 2
            //     },
            //     {
            //         title: "🍋",
            //         id: 3
            //     }
            // ]
        },
        created: function() {
            console.log("created");
        },
        mounted: function() {
            console.log("mounted");
            var vueInstance = this;
            axios
                .get("/images")
                .then(function(results) {
                    console.log("results.data: ", results.data);
                    vueInstance.images = results.data;
                })
                .catch(function(err) {
                    console.log("err: ", err);
                });
        },

        methods: {
            closeMe: function(count) {
                console.log("I need to close the modal!!", count);
                // here we can update the value of selectedFruit
            },

            handleClick: function(e) {
                e.preventDefault();
                console.log("this: ,", this);
                // this lets us see what was typed in the input field
                // we need to use formData to send a file to the server
                var formData = new FormData();
                formData.append("title", this.title);
                formData.append("description", this.description);
                formData.append("username", this.username);
                formData.append("file", this.file);
                // if I try to console.log formData, i'll get an empty objet

                var vueInstance = this;

                axios
                    .post("/upload", formData)
                    .then(function(resp) {
                        console.log("resp from post/upload: ", resp);
                        vueInstance.images.unshift(resp.data[0]);
                    })
                    .catch(err => {
                        console.log("err in resp/upload: ", err);
                    });
            },

            handleChange: function(e) {
                console.log("haddleChange is running");
                console.log("file", e.target.files[0]);
                this.file = e.target.files[0];
            }
        }
    });
})();

//
