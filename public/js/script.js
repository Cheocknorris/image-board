(function() {
    Vue.component("image-component", {
        template: "#modal",
        props: ["id"],
        data: function() {
            return {
                image: null,
                comment: "",
                username: null,
                comments: [],
                previousId: null,
                nextId: null
            };
        },
        mounted: function() {
            console.log("component mounted: ");
            console.log("id: ", this.id);
            console.log("this.id:", parseInt(this.id));
            var vueInstance = this;
            axios
                .get("/selected/" + this.id)
                .then(function(results) {
                    console.log("results.data : ", results.data);
                    vueInstance.image = results.data[0];
                    console.log("vueInstance.images: ", vueInstance.image);
                    console.log("vueInstance.images: ", vueInstance.image);
                    console.log("current id: ", vueInstance.image.id);
                    console.log("previous id: ", vueInstance.image.previousId);
                    console.log("next id: ", vueInstance.image.nextId);
                    vueInstance.previousId = results.data[0].previousId;
                    vueInstance.nextId = results.data[0].nextId;
                })
                .catch(function(err) {
                    console.log("err: ", err);
                });

            axios
                .get("/comment/" + this.id)
                .then(function(results) {
                    console.log("comment results data: ", results.data);
                    vueInstance.comments = results.data;
                    console.log("vueInstance.comment :", vueInstance.comment);
                })
                .catch(function(err) {
                    console.log("err: ", err);
                });
        },

        watch: {
            id: function() {
                var vueInstance = this;

                if (isNaN(parseInt(this.id))) {
                    this.closeModal();
                } else {
                    axios
                        .get("/selected/" + this.id)
                        .then(function(results) {
                            console.log(
                                "results.data when changing url: ",
                                results.data
                            );
                            if (results.data.length == 0) {
                                vueInstance.closeModal();
                            } else {
                                vueInstance.image = results.data[0];
                                vueInstance.previousId =
                                    results.data[0].previousId;
                                vueInstance.nextId = results.data[0].nextId;
                            }
                        })
                        .catch(function(err) {
                            console.log("err: ", err);
                        });
                    axios
                        .get("/comment/" + this.id)
                        .then(function(results) {
                            console.log("comment results data: ", results.data);
                            vueInstance.comments = results.data;
                            console.log(
                                "vueInstance.comment :",
                                vueInstance.comment
                            );
                        })
                        .catch(function(err) {
                            console.log("err: ", err);
                        });
                }
            }
        },

        methods: {
            closeModal: function() {
                this.$emit("close");
            },

            // previous: function() {
            //     console.log("left arrow clicked");
            //     var vueInstance = this;
            //     let previousId = vueInstance.image.previousId;
            //     console.log("previous id: ", previousId);
            // },
            //
            // next: function() {
            //     console.log("right arrow clicked");
            // },

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
            selectedImage: location.hash.slice(1),
            heading: "IMAGE BOARD",
            images: [],
            title: "",
            description: "",
            username: "",
            file: null,
            classMainContainer: "main-container",
            classContainer: "container",
            classPicture: "picture",
            classTitle: "title",
            lastId: null
        },
        created: function() {
            console.log("created");
        },
        mounted: function() {
            console.log("mounted");
            var vueInstance = this;
            addEventListener("hashchange", function() {
                console.log("hash change happened");
                vueInstance.selectedImage = location.hash.slice(1);
            });

            axios
                .get("/images")
                .then(function(results) {
                    console.log("results.data: ", results.data);
                    var latestPic = results.data.length - 1;
                    var latestPicId = results.data[latestPic].id;
                    console.log("id of last pic:", latestPicId);
                    vueInstance.images = results.data;
                    vueInstance.lastId = latestPicId;
                })
                .catch(function(err) {
                    console.log("err: ", err);
                });
        },

        methods: {
            closeMe: function() {
                this.selectedImage = null;
                // location.hash + "";
                history.replaceState(null, null, " ");
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

            loadMore: function(e) {
                e.preventDefault();
                var vueInstance = this;
                console.log("more button clicked");
                console.log("vueInstance", vueInstance);
                console.log("vueInstance.lastId: ", vueInstance.lastId);

                axios
                    .get("/more/" + this.lastId)
                    .then(function(results) {
                        console.log(
                            "results.data from getMoreImages: ",
                            results.data
                        );
                        vueInstance.lastId =
                            results.data[results.data.length - 1].id;
                        for (var i in results.data) {
                            vueInstance.images.push(results.data[i]);
                        }
                        console.log("vueInstance.lastId:", vueInstance.lastId);
                        console.log(
                            "results.data.lowestId:",
                            results.data[i].lowestId
                        );
                        if (vueInstance.lastId === results.data[i].lowestId) {
                            vueInstance.lastId = null;
                        }
                    })
                    .catch(function(err) {
                        console.log("err: ", err);
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
