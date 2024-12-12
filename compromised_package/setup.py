# setup.py

from setuptools import setup, find_packages
import os

setup(
    name='sample_malpack',
    version='0.1.0',
    packages=find_packages(),
    install_requires=[
        'djanggo==0.0.8',  # this is the malicious package
    ],
    entry_points={
        'console_scripts': [
            'sample_malpack=sample_malpack.main:main',
        ],
    },
    author='Your Name',
    author_email='your.email@example.com',
    description='A sample package that imports a "badguy" library for SBOM testing',
    long_description=open('README.md').read() if os.path.exists('README.md') else '',
    long_description_content_type='text/markdown',
    url='https://github.com/yourusername/sample_malpack',
    classifiers=[
        'Programming Language :: Python :: 3',
        'License :: OSI Approved :: MIT License',
        'Operating System :: OS Independent',
    ],
    python_requires='>=3.6',
)