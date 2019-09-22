#!/bin/bash
# Set up environment variables
export AWS_ACCESS_KEY_ID=""
export AWS_SECRET_ACCESS_KEY=""
export AWS_DEFAULT_REGION="us-east-1"
export AWS_S3_BUCKET="aosreminders.com/"
SITE_S3="s3://aosreminders.com/"
SITE_BUILD_DIR="./build/"
CF_DIST_ID="E3OO9Y9QRVZ2L1"
CF_PATH="/*"

# Set up our environment, install dependencies, and build
pip install awscli
yarn install
yarn build

# Upload to S3 and invalidate the Cloudfront cache
echo "Now uploading to S3"
aws s3 sync --delete ${SITE_BUILD_DIR} ${SITE_S3} --exclude "*build_log.txt" --exclude "*.idea*" --exclude "*.sh" --exclude "*.git*" --exclude "*.DS_Store"
echo "Now invalidating CF cache"
aws cloudfront create-invalidation --distribution-id ${CF_DIST_ID} --paths "${CF_PATH}"
echo "Deployed to https://aosreminders.com/"
